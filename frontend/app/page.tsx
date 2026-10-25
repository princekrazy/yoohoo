"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { mockVideos } from "@/lib/mock-videos";
import VideoGrid from "@/components/VideoGrid";

const categories = ["All", "Travel", "People", "Education", "Vlogs", "Nature", "Technology"];

export default function Home() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const syncFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    setCategory(params.get("category") || "All");
    setSort(params.get("sort") || "recent");
  };

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key));
    window.history.pushState(null, "", params.toString() ? `/?${params.toString()}` : "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const videos = useMemo(() => {
    const filtered = mockVideos.filter((video) => (category === "All" || video.category === category) && `${video.title} ${video.creator.name} ${video.category}`.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a, b) => sort === "popular" ? b.views - a.views : mockVideos.indexOf(a) - mockVideos.indexOf(b));
  }, [category, query, sort]);

  const clearFilters = () => updateUrl({ q: "", category: "", sort: "" });

  return <>
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:hidden"><Search size={16} className="absolute left-3 top-2.5 text-muted" /><label htmlFor="feed-search" className="sr-only">Search videos</label><input id="feed-search" value={query} onChange={(e) => { setQuery(e.target.value); updateUrl({ q: e.target.value }); }} placeholder="Search videos" className="h-10 w-full rounded-xl border border-line bg-content pl-9 pr-3 text-sm outline-none focus:border-secondary" /></div>
      <div className="scrollbar-hide flex min-w-0 gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => updateUrl({ category: item === "All" ? "" : item })} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${category === item ? "bg-button-hover text-primary" : "bg-panel text-secondary hover:bg-button-hover"}`}>{item}</button>)}</div>
    </div>
    {videos.length ? <VideoGrid videos={videos} /> : <div className="surface rounded-2xl py-20 text-center"><p className="font-semibold">No videos found</p><p className="mt-2 text-sm text-muted">Try another search or category.</p><button onClick={clearFilters} className="mt-5 text-sm font-semibold text-secondary hover:text-primary">Clear filters</button></div>}
  </>;
}
