"use client";

import { Video } from "@/lib/types";
import VideoCard from "./VideoCard";

export default function VideoGrid({ videos }: { videos: Video[] }) {
  return (
    <div className="grid gap-x-[clamp(1rem,1.5vw,1.25rem)] gap-y-[clamp(2rem,4vw,2.5rem)] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
