"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import VideoFeed from "@/components/VideoFeed";

export default function Home() {
  return (
    <>
      <section className="relative mb-9 overflow-hidden rounded-3xl border border-lime/15 bg-lime/5 px-6 py-8 sm:px-10 sm:py-10">
        <div className="relative z-10 max-w-xl">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-lime">
            <Sparkles size={15} /> A more human feed
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Real videos.
            <br />
            <span className="text-lime">Real people.</span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-neutral-400 sm:text-base">
            Yoohoo is a place to share the moments, ideas, and stories that only
            humans can make.
          </p>

          <Link
            href="/upload"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink transition hover:bg-[#dafa83]"
          >
            Share your story <ArrowRight size={16} />
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-32 h-96 w-96 rounded-full border border-lime/20" />
        <div className="pointer-events-none absolute -right-5 -top-20 h-72 w-72 rounded-full border border-lime/10" />
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-600">
            The latest from the community
          </p>
          <h2 className="mt-1 text-xl font-bold">Discover something real</h2>
        </div>

        <VideoFeed />
      </section>

      <Footer />
    </>
  );
}
