"use client";

import { useEffect, useState } from "react";
import { useAcceptedVideos } from "@/lib/accepted-videos";

type BackendVideo = {
  id: string;
  title: string;
  playback_url: string;
  created_at: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

export default function VideoFeed() {
  const acceptedVideos = useAcceptedVideos();
  const [backendVideos, setBackendVideos] = useState<BackendVideo[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!API) {
      setError("Backend API URL is not configured.");
      return;
    }

    fetch(`${API}/api/videos`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load backend videos.");
        }
        return response.json();
      })
      .then((data) => {
        setBackendVideos(Array.isArray(data.videos) ? data.videos : []);
        setError("");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not load videos.");
      });
  }, []);

  const hasVideos = acceptedVideos.length > 0 || backendVideos.length > 0;

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {acceptedVideos.map((video) => (
        <article
          key={video.id}
          className="overflow-hidden rounded-xl border border-lime/30"
        >
          <video
            className="aspect-video w-full bg-black object-contain"
            src={video.videoUrl}
            controls
            playsInline
            preload="metadata"
          />
          <div className="p-4">
            <p className="mb-1 text-xs font-semibold text-lime">
              JUST ACCEPTED
            </p>
            <h2 className="font-semibold">{video.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {video.creator.name} ·{" "}
              {new Date(video.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </article>
      ))}

      {backendVideos.map((video) => (
        <article key={video.id} className="overflow-hidden rounded-xl border">
          <video
            className="aspect-video w-full bg-black object-contain"
            src={video.playback_url}
            controls
            playsInline
            preload="metadata"
          />
          <div className="p-4">
            <h2 className="font-semibold">{video.title}</h2>
            <p className="text-sm text-neutral-500">
              {new Date(video.created_at).toLocaleDateString()}
            </p>
          </div>
        </article>
      ))}

      {!hasVideos && (
        <p className="text-neutral-500">
          {error || "No approved videos yet. Upload one to get started!"}
        </p>
      )}
    </section>
  );
}
