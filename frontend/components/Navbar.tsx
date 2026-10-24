"use client";
import Link from "next/link";
import { Bell, Menu, Search, Upload, UserRound } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-30 border-b border-line bg-[#090b0c]/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-10">
    <button onClick={() => setOpen(!open)} aria-label="Toggle navigation" className="rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white lg:hidden"><Menu size={20} /></button>
    <Link href="/" className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-lime text-sm font-black text-ink">Y</span><span className="text-xl font-bold tracking-tight">yoohoo<span className="text-lime">.</span></span></Link>
    <div className="mx-auto hidden w-full max-w-xl md:block"><form action="/" className="flex h-10 overflow-hidden rounded-full border border-line bg-panel"><label htmlFor="nav-search" className="sr-only">Search videos</label><input id="nav-search" name="q" placeholder="Search real stories..." className="min-w-0 flex-1 bg-transparent px-5 text-sm outline-none placeholder:text-neutral-600" /><button aria-label="Search" className="px-4 text-neutral-400 hover:text-lime"><Search size={18} /></button></form></div>
    <div className="ml-auto flex items-center gap-1 sm:gap-3"><Link href="/upload" className="flex items-center gap-2 rounded-full bg-lime px-3 py-2 text-sm font-bold text-ink transition hover:bg-[#dafa83] sm:px-4"><Upload size={16} /><span className="hidden sm:inline">Upload</span></Link><button aria-label="Notifications" className="hidden rounded-full p-2 text-neutral-400 hover:bg-white/5 hover:text-white sm:block"><Bell size={19} /></button><button aria-label="Profile" className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-neutral-300 hover:border-lime"><UserRound size={17} /></button></div>
  </div>{open && <div className="border-t border-line bg-panel px-4 py-3 lg:hidden"><Link href="/" className="block rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/5">Home</Link><Link href="/upload" className="block rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/5">Upload video</Link></div>}</header>;
}
