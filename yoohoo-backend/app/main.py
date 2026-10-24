
import os
import tempfile
from pathlib import Path

import asyncio
import csv
import shutil
import subprocess
import sys
from statistics import mean

import cv2
from fastapi import FastAPI, File, HTTPException, UploadFile

app = FastAPI(
    title="Yoohoo API",
    description="Backend for a video authenticity platform",
    version="0.1.0",
)

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB
MAX_SAMPLED_FRAMES = 12
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm"}


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Yoohoo API"}


def inspect_video(video_path: str) -> dict:
    """Read video metadata and sample frames for later analysis."""
    cap = cv2.VideoCapture(video_path)

    try:
        if not cap.isOpened():
            raise ValueError("Could not decode the uploaded video.")

        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        if fps <= 0 or frame_count <= 0:
            raise ValueError("Video has invalid duration or frame metadata.")

        duration = frame_count / fps
        timestamps = []

        # Sample approximately one frame per second, with a limit.
        sample_count = min(
            max(1, int(duration) + 1),
            MAX_SAMPLED_FRAMES,
        )

        for i in range(sample_count):
            timestamp = min(float(i), max(0.0, duration - 0.05))
            cap.set(cv2.CAP_PROP_POS_MSEC, timestamp * 1000)

            success, frame = cap.read()

            if success and frame is not None:
                timestamps.append(round(timestamp, 2))

        if not timestamps:
            raise ValueError("No readable video frames were found.")

        return {
            "duration_seconds": round(duration, 2),
            "fps": round(fps, 2),
            "frame_count": frame_count,
            "sampled_frames": len(timestamps),
            "sampled_timestamps": timestamps,
        }
    finally:
        cap.release()


NVIDIA_SCRIPT = (
    Path(__file__).resolve().parent.parent
    / "nim-clients"
    / "synthetic-video-detector"
    / "scripts"
    / "v1"
    / "synthetic-video-detector.py"
)


def analyze_with_nvidia(video_path: str) -> dict:
    """Run NVIDIA's detector and aggregate its sample scores."""
    api_key = os.environ.get("NVIDIA_API_KEY", "").strip()

    if not api_key:
        raise RuntimeError("NVIDIA_API_KEY is not configured.")

    if not NVIDIA_SCRIPT.is_file():
        raise RuntimeError(f"Detector script not found: {NVIDIA_SCRIPT}")

    # NVIDIA's tested client requires MP4 input.
    if Path(video_path).suffix.lower() != ".mp4":
        raise ValueError(
            "NVIDIA detection currently requires MP4 videos."
        )

    with tempfile.TemporaryDirectory() as directory:
        work_dir = Path(directory)
        input_video = work_dir / "upload.mp4"
        shutil.copyfile(video_path, input_video)

        command = [
            sys.executable,
            str(NVIDIA_SCRIPT),
            "--preview-mode",
            "--target", "grpc.nvcf.nvidia.com:443",
            "--function-id",
            "847b6e53-0133-452d-ab85-d7acf3ace723",
            "--api-key", api_key,
            "--video-input", str(input_video),
            "--save-csv",
        ]

        try:
            result = subprocess.run(
                command,
                cwd=work_dir,
                capture_output=True,
                text=True,
                timeout=300,
            )
        except subprocess.TimeoutExpired as exc:
            raise RuntimeError("NVIDIA detection timed out.") from exc

        csv_path = work_dir / "upload.csv"

        if (
            result.returncode != 0
            or "Detection completed successfully!" not in result.stdout
            or not csv_path.is_file()
        ):
            # Avoid returning environment variables or the API key.
            raise RuntimeError(
                "NVIDIA detection failed. Check the detector logs."
            )

        with csv_path.open(newline="", encoding="utf-8") as csv_file:
            rows = list(csv.DictReader(csv_file))

        scores = [float(row["probability"]) for row in rows]

        if not scores:
            raise RuntimeError("NVIDIA returned no detection scores.")

        return {
            "mean_probability": round(mean(scores), 6),
            "min_probability": round(min(scores), 6),
            "max_probability": round(max(scores), 6),
            "samples_analyzed": len(scores),
        }



@app.post("/api/videos/analyze")
async def analyze_video(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported video format.",
        )

    temp_path = None

    try:
        # Stream to a temporary file while enforcing the size limit.
        size = 0

        with tempfile.NamedTemporaryFile(
            suffix=extension, delete=False
        ) as temp:
            temp_path = temp.name

            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                size += len(chunk)

                if size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="Video exceeds the 100 MB limit.",
                    )

                temp.write(chunk)

        if size == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        try:
            metadata = inspect_video(temp_path)
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail=str(exc),
            ) from exc

       
        if extension != ".mp4":
            raise HTTPException(
                status_code=400,
                detail="AI analysis currently supports MP4 videos only.",
            )

        try:
            detection = await asyncio.to_thread(
                analyze_with_nvidia, temp_path
            )
        except (RuntimeError, ValueError) as exc:
            raise HTTPException(
                status_code=502,
                detail=str(exc),
            ) from exc

        return {
            "status": "analyzed",
            "filename": Path(file.filename).name,
            "file_size_bytes": size,
            "video": metadata,
            "detection": {
                "model_integrated": True,
                **detection,
                "message": (
                    "NVIDIA synthetic-video analysis completed. "
                    "Review the scores before making an authenticity decision."
                ),
            },
        }


    finally:
        await file.close()

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
