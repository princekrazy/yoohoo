export type VideoCategory =
  | "Travel"
  | "People"
  | "Education"
  | "Vlogs"
  | "Nature"
  | "Technology";

export type VerificationStatus =
  | "idle"
  | "selected"
  | "uploading"
  | "processing"
  | "approved"
  | "rejected"
  | "review_required"
  | "error";

export type DetectionSummary = {
  model_integrated: boolean;
  mean_probability: number;
  min_probability: number;
  max_probability: number;
  samples_analyzed: number;
  message: string;
  threshold?: number;
  decision?: "accept" | "reject";
};

export type BackendAnalysisResponse = {
  status: "analyzed" | "approved" | "rejected";
  filename: string;
  file_size_bytes: number;
  video: {
    duration_seconds: number;
    fps: number;
    frame_count: number;
    sampled_frames: number;
    sampled_timestamps: number[];
  };
  detection: DetectionSummary;
};

export type Creator = {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  subscribers: number;
  description: string;
};

export type AnalysisResult = {
  status: VerificationStatus;
  score?: number;
  flaggedTimestamps?: number[];
  explanation: string;
  provenanceStatus?: "verified" | "unavailable" | "not_checked";
  isMock?: boolean;
  detection?: DetectionSummary;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  creator: Creator;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  views: number;
  uploadedAt: string;
  category: VideoCategory;
  verificationStatus: VerificationStatus;
  analysis?: AnalysisResult;
};
