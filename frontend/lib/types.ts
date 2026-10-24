export type VideoCategory = "Travel" | "People" | "Education" | "Vlogs" | "Nature" | "Technology";
export type VerificationStatus = "idle" | "selected" | "uploading" | "processing" | "approved" | "rejected" | "review_required" | "error";

export type Creator = { id: string; name: string; handle: string; avatar?: string; subscribers: number; description: string };
export type AnalysisResult = { status: VerificationStatus; score?: number; flaggedTimestamps?: number[]; explanation: string; provenanceStatus?: "verified" | "unavailable" | "not_checked"; isMock?: boolean };
export type Video = { id: string; title: string; description: string; creator: Creator; thumbnailUrl: string; videoUrl: string; duration: string; views: number; uploadedAt: string; category: VideoCategory; verificationStatus: VerificationStatus; analysis?: AnalysisResult };
