"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { playRejectionSound } from "@/lib/feedback";
import { addAcceptedVideo } from "@/lib/accepted-videos";

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
const SYNTHETIC_THRESHOLD = 0.3;

type UploadResponse = {
  status?: string;
  detection?: {
    mean_probability?: number;
    threshold?: number;
    decision?: "accept" | "reject";
    message?: string;
  };
};

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<
    "approved" | "rejected" | "error" | null
  >(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOutcome(null);

    if (!file || !title.trim()) {
      setMessage("Add a title and choose a video.");
      setOutcome("error");
      return;
    }

    // The current NVIDIA detector integration supports MP4 only.
    if (!file.name.toLowerCase().endsWith(".mp4")) {
      setMessage("Please upload an MP4 video for AI detection.");
      setOutcome("error");
      return;
    }

    if (!API) {
      setMessage("API URL is missing. Check your frontend .env.local file.");
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

      const result: UploadResponse & { detail?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Upload or video analysis failed.");
      }

      const detection = result.detection;
      const score = detection?.mean_probability;
      const threshold = detection?.threshold ?? SYNTHETIC_THRESHOLD;

      // Prefer the backend's explicit decision, then fall back to its score.
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
          `Upload rejected: this video was flagged as likely AI-generated. ` +
            (typeof score === "number"
              ? `Synthetic score: ${(score * 100).toFixed(1)}%. `
              : "") +
            "You can try another video.",
        );

        playRejectionSound();
        return;
      }

      // Only accepted videos are added to the home feed.
      addAcceptedVideo(file, {
        title: title.trim(),
        description: "",
        category: "Vlogs",
      });

      setOutcome("approved");
      setMessage(
        `Video accepted! ${
          typeof score === "number"
            ? `Synthetic score: ${(score * 100).toFixed(1)}%. `
            : ""
        }Your video is ready for the Yoohoo home feed.`,
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
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Upload to Yoohoo</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Every video is checked before it can appear in the community feed.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Video title
          <input
            className="mt-1 w-full rounded border p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
            disabled={busy}
          />
        </label>

        <label className="block">
          Choose a video (MP4)
          <input
            className="mt-1 block w-full"
            type="file"
            accept="video/mp4,.mp4"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            disabled={busy}
          />
        </label>

        {file && (
          <p className="text-sm text-neutral-500">
            Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
          </p>
        )}

        <button
          className="rounded bg-black px-5 py-3 text-white disabled:opacity-50"
          disabled={busy}
          type="submit"
        >
          {busy ? "Analyzing..." : "Upload video"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-5 rounded-lg border p-4 ${
            outcome === "approved"
              ? "border-green-500/40 bg-green-500/10 text-green-700"
              : outcome === "rejected"
                ? "border-red-500/40 bg-red-500/10 text-red-700"
                : outcome === "error"
                  ? "border-orange-500/40 bg-orange-500/10"
                  : "border-neutral-500/30"
          }`}
          role="status"
          aria-live="polite"
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
          <p className="mt-1 text-sm">{message}</p>

          {outcome === "approved" && (
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-3 rounded bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              View home feed
            </button>
          )}
        </div>
      )}
    </main>
  );
}
