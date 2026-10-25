import { Video } from "@/lib/types";
import VideoCard from "./VideoCard";
export default function VideoGrid({ videos }: { videos: Video[] }) { return <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{videos.map((video) => <VideoCard key={video.id} video={video} />)}</div>; }
