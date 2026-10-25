"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { playRejectionSound } from "@/lib/feedback";
import { addAcceptedVideo } from "@/lib/accepted-videos";

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
const SYNTHETIC_THRESHOLD = 0.3;
const MAX_SIZE = 100 * 1024 * 1024;

type UploadResponse = {
  status?: string;
  detail?: string;
  detection?: {
    mean_probability?: number;
    threshold?: number;
    decision?: "accept" | "reject";
    message?: string;
  };
};

type Outcome = "approved" | "rejected" | "error" | null;

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Travel");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function selectFile(next: File | undefined) {
    if (!next) return;

    setOutcome(null);
    setMessage("");

    if (!next.name.toLowerCase().endsWith(".mp4")) {
      setFile(null);
      setMessage("Please choose an MP4 video for authenticity checking.");
      setOutcome("error");
      return;
    }

    if (next.size > MAX_SIZE) {
      setFile(null);
      setMessage("This video exceeds the 100 MB upload limit.");
      setOutcome("error");
      return;
    }

    setFile(next);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOutcome(null);
    setMessage("");

    if (!file || !title.trim()) {
      setMessage("Add a title and choose a video.");
      setOutcome("error");
      return;
    }

    if (!API) {
      setMessage("API URL is missing. Check NEXT_PUBLIC_API_BASE_URL.");
      setOutcome("error");
      return;
    }

    const form = new FormData();
    form.append("title", title.trim());
    form.append("file", file);

    setBusy(true);
    setMessage("Uploading and analyzing your video...");

    try {
      const response = await fetch(`${API}/api/videos/analyze`, {
        method: "POST",
        body: form,
      });

      const result: UploadResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Upload or video analysis failed.");
      }

      const detection = result.detection;
      const score = detection?.mean_probability;
      const threshold = detection?.threshold ?? SYNTHETIC_THRESHOLD;

      let rejected: boolean;

      if (result.status === "rejected" || detection?.decision === "reject") {
        rejected = true;
      } else if (
        result.status === "approved" ||
        result.status === "published" ||
        detection?.decision === "accept"
      ) {
        rejected = false;
      } else if (typeof score === "number") {
        rejected = score >= threshold;
      } else {
        throw new Error(
          "The detector response did not contain a usable decision or score.",
        );
      }

      if (rejected) {
        setOutcome("rejected");
        setMessage(
          `This video was flagged as likely AI-generated.${
            typeof score === "number"
              ? ` Synthetic score: ${(score * 100).toFixed(1)}%.`
              : ""
          } Please try another video.`,
        );
        playRejectionSound();
        return;
      }

      addAcceptedVideo(file, {
        title: title.trim(),
        description: description.trim(),
        category,
      });

      setOutcome("approved");
      setMessage(
        `Video accepted.${
          typeof score === "number"
            ? ` Synthetic score: ${(score * 100).toFixed(1)}%.`
            : ""
        } Your video is ready for the Yoohoo home feed.`,
      );
    } catch (error) {
      setOutcome("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-coral">
          Creator studio
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Upload a new video
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Every video is checked before it can appear in the Yoohoo community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"
      >
        <div>
          <label
            htmlFor="video"
            className="flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel text-center"
          >
            {preview ? (
              <video
                src={preview}
                controls
                className="h-full w-full bg-black object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span className="mb-3 text-4xl text-coral">↑</span>
                <span className="font-semibold">Choose your video</span>
                <span className="mt-2 text-xs text-neutral-500">
                  MP4 format · Maximum 100 MB
                </span>
              </>
            )}
          </label>

          <input
            id="video"
            type="file"
            accept="video/mp4,.mp4"
            className="sr-only"
            onChange={(e) => selectFile(e.target.files?.[0])}
            disabled={busy}
          />

          {file && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-panel px-4 py-3 text-sm">
              <span className="min-w-0 truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-neutral-500">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
          )}

          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setOutcome(null);
                setMessage("");
              }}
              disabled={busy}
              className="mt-3 text-xs font-semibold text-neutral-500 hover:text-white disabled:opacity-50"
            >
              Remove video
            </button>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              placeholder="Give your video a title"
              required
              disabled={busy}
              className="mt-2 w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none placeholder:text-neutral-600 focus:border-coral"
            />
          </label>

          <label className="block text-sm font-medium">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="What should people know about your video?"
              disabled={busy}
              className="mt-2 w-full resize-y rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none placeholder:text-neutral-600 focus:border-coral"
            />
          </label>

          <label className="block text-sm font-medium">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={busy}
              className="mt-2 w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-coral"
            >
              {[
                "Travel",
                "People",
                "Education",
                "Vlogs",
                "Nature",
                "Technology",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={busy || !file}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6262] disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? "Checking authenticity..." : "Upload & check video"}
          </button>
        </div>

        {message && (
          <div
            role={outcome === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`lg:col-span-2 rounded-xl border px-4 py-4 text-sm ${
              outcome === "approved"
                ? "border-green-500/40 bg-green-500/10 text-green-400"
                : outcome === "rejected"
                  ? "border-red-500/40 bg-red-500/10 text-red-400"
                  : outcome === "error"
                    ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
                    : "border-line"
            }`}
          >
            <p className="font-semibold">
              {outcome === "approved"
                ? "✓ Video accepted"
                : outcome === "rejected"
                  ? "✕ Video rejected"
                  : outcome === "error"
                    ? "Upload failed"
                    : "Analyzing video"}
            </p>
            <p className="mt-1">{message}</p>

            {outcome === "approved" && (
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-3 rounded-lg bg-coral px-4 py-2 font-semibold text-white"
              >
                View home feed
              </button>
            )}
          </div>
        )}
      </form>

      <div className="mt-10 rounded-2xl border border-line bg-panel/50 p-5 text-xs leading-5 text-neutral-500">
        <strong className="text-neutral-300">Publication policy:</strong> Videos
        are checked using the configured backend detector. A detector score is a
        signal, not absolute proof that a video is authentic or synthetic.
        <p className="mt-2">
          Only videos accepted by the analysis response are added to the local
          home feed.
        </p>
      </div>
    </main>
  );
}
