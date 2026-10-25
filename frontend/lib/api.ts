import { mockVideos } from "./mock-videos";
import { AnalysisResult, BackendAnalysisResponse, Video } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const isReal = process.env.NEXT_PUBLIC_API_MODE === "real" && Boolean(baseUrl);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { ...(init?.headers || {}) },
  });

  if (!response.ok) {
    let message = `Backend request failed (${response.status}).`;

    try {
      const body = await response.json();

      if (typeof body.detail === "string") {
        message = body.detail;
      }
    } catch {
      // Keep the default error message if the response isn't JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  mode: (isReal ? "real" : "mock") as "real" | "mock",

  async listVideos(): Promise<Video[]> {
    return isReal ? request<Video[]>("/videos") : mockVideos;
  },

  async getVideo(id: string): Promise<Video | undefined> {
    return isReal
      ? request<Video>(`/videos/${id}`)
      : mockVideos.find((video) => video.id === id);
  },

  async getAnalysis(id: string): Promise<AnalysisResult | undefined> {
    return isReal
      ? request<AnalysisResult>(`/videos/${id}/analysis`)
      : mockVideos.find((video) => video.id === id)?.analysis;
  },

  async submitVideo(
    file: File,
    metadata: Record<string, string>,
  ): Promise<AnalysisResult> {
    if (!isReal) {
      await new Promise((resolve) => setTimeout(resolve, 1800));

      return {
        status: "review_required",
        explanation:
          "Demo mode did not contact the authenticity detector. This upload has not been approved for publication.",
        provenanceStatus: "not_checked",
        isMock: true,
      };
    }

    const form = new FormData();
    form.append("file", file);

    Object.entries(metadata).forEach(([key, value]) => {
      form.append(key, value);
    });

    const response = await request<BackendAnalysisResponse>(
      "/api/videos/analyze",
      {
        method: "POST",
        body: form,
      },
    );

    return {
      status: "review_required",
      explanation:
        response.detection?.message ||
        "The detector completed. Review is required before publication.",
      score: response.detection?.mean_probability,
      provenanceStatus: "unavailable",
      isMock: false,
      detection: response.detection,
    };
  },
};
