
import csv
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from statistics import mean

NVIDIA_SCRIPT = (
    Path(__file__).resolve().parent
    / "nim-clients"
    / "synthetic-video-detector"
    / "scripts"
    / "v1"
    / "synthetic-video-detector.py"
)

def analyze_with_nvidia(video_path: str) -> dict:
    api_key = os.environ.get("NVIDIA_API_KEY", "").strip()

    if not api_key:
        raise RuntimeError("NVIDIA_API_KEY is not configured")

    if not NVIDIA_SCRIPT.is_file():
        raise RuntimeError(f"Detector script not found: {NVIDIA_SCRIPT}")

    with tempfile.TemporaryDirectory() as temp_dir:
        work_dir = Path(temp_dir)
        input_video = work_dir / "upload.mp4"
        input_video.write_bytes(Path(video_path).read_bytes())

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

        result = subprocess.run(
            command,
            cwd=work_dir,
            capture_output=True,
            text=True,
            timeout=300,
        )

        if result.returncode != 0 or "Detection completed successfully!" not in result.stdout:
            raise RuntimeError(
                f"NVIDIA detection failed: {result.stderr or result.stdout}"
            )

        csv_path = work_dir / "upload.csv"

        if not csv_path.is_file():
            raise RuntimeError("NVIDIA did not produce the expected CSV")

        with csv_path.open(newline="", encoding="utf-8") as csv_file:
            rows = list(csv.DictReader(csv_file))

        scores = [float(row["probability"]) for row in rows]

        if not scores:
            raise RuntimeError("NVIDIA returned no detection scores")

        return {
            "score": mean(scores),
            "min_score": min(scores),
            "max_score": max(scores),
            "samples_analyzed": len(scores),
        }
