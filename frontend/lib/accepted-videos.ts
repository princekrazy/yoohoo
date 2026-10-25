"use client";

import { useSyncExternalStore } from "react";
import { mockVideos } from "./mock-videos";
import type { Video, VideoCategory } from "./types";

const EMPTY_VIDEOS: Video[] = [];

let acceptedVideos: Video[] = [];
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return acceptedVideos;
}

function getServerSnapshot() {
  return EMPTY_VIDEOS;
}

export function useAcceptedVideos() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addAcceptedVideo(file: File, metadata: Record<string, string>) {
  const categories: VideoCategory[] = [
    "Travel",
    "People",
    "Education",
    "Vlogs",
    "Nature",
    "Technology",
  ];

  const requestedCategory = metadata.category as VideoCategory;
  const category = categories.includes(requestedCategory)
    ? requestedCategory
    : "Vlogs";

  const video: Video = {
    id: `upload-${crypto.randomUUID()}`,
    title: metadata.title?.trim() || file.name,
    description: metadata.description?.trim() || "",
    creator: {
      id: "demo-user",
      name: "You",
      handle: "@you",
      subscribers: 0,
      description: "Yoohoo creator",
    },
    thumbnailUrl: mockVideos[0]?.thumbnailUrl ?? "",
    videoUrl: URL.createObjectURL(file),
    duration: "New",
    views: 0,
    uploadedAt: new Date().toISOString(),
    category,
    verificationStatus: "approved",
  };

  acceptedVideos = [video, ...acceptedVideos];
  listeners.forEach((listener) => listener());

  return video;
}
