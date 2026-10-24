import { mockVideos } from "./mock-videos";
import { AnalysisResult, Video } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const isReal = process.env.NEXT_PUBLIC_API_MODE === "real" && Boolean(baseUrl);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { ...(init?.headers || {}) } });
  if (!response.ok) throw new Error(`Backend request failed (${response.status}).`);
  return response.json();
}

export const api = {
  mode: isReal ? "real" : "mock" as "real" | "mock",
  async listVideos() { return isReal ? request<Video[]>("/videos") : mockVideos; },
  async getVideo(id: string) { return isReal ? request<Video>(`/videos/${id}`) : mockVideos.find((video) => video.id === id); },
  async getAnalysis(id: string) { return isReal ? request<AnalysisResult>(`/videos/${id}/analysis`) : mockVideos.find((video) => video.id === id)?.analysis; },
  async submitVideo(file: File, metadata: Record<string, string>) {
    if (!isReal) { await new Promise((resolve) => setTimeout(resolve, 1800)); return { status: "approved" as const, explanation: "Demo result only: no backend detector was contacted.", provenanceStatus: "not_checked" as const, isMock: true }; }
    const form = new FormData(); form.append("file", file); Object.entries(metadata).forEach(([key, value]) => form.append(key, value));
    return request<AnalysisResult>("/videos", { method: "POST", body: form });
  },
};
