"use client";
import Link from "next/link";
import Image from "next/image";
import { Bell, Search, Upload } from "lucide-react";

export default function Navbar() {
  return <header className="sticky top-0 z-30 bg-[#18191B]/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-[clamp(1rem,3vw,2rem)]">
    <Link href="/" aria-label="Yoohoo home" className="flex shrink-0 items-center gap-3" title="Yoohoo home"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl"><Image src="/yoohoo-logo.svg" alt="Yoohoo" width={40} height={40} className="h-full w-full object-contain" priority /></span><span className="text-lg font-semibold tracking-[-0.02em] text-primary sm:text-xl">yoohoo</span></Link>
    <div className="mx-auto hidden w-full max-w-[620px] md:block"><form action="/" className="flex h-11 overflow-hidden rounded-xl border border-line bg-content"><label htmlFor="nav-search" className="sr-only">Search videos</label><input id="nav-search" name="q" placeholder="Search videos" className="min-w-0 flex-1 bg-transparent px-5 text-sm outline-none placeholder:text-neutral-500" /><button aria-label="Search" className="grid w-14 place-items-center text-neutral-400 transition hover:bg-button-hover hover:text-primary"><Search size={18} /></button></form></div>
    <div className="ml-auto flex items-center gap-2"><Link href="/upload" className="flex h-10 items-center gap-2 rounded-xl bg-button px-4 text-sm font-bold text-primary transition hover:bg-button-hover"><Upload size={16} /><span className="hidden sm:inline">Create</span></Link><button disabled title="Notifications are not connected to a backend yet" aria-label="Notifications unavailable" className="hidden rounded-lg p-2 text-neutral-300 opacity-60 transition hover:bg-button-hover sm:block"><Bell size={19} /></button><Link href="/channel/maya" aria-label="Profile" className="grid h-9 w-9 place-items-center rounded-lg bg-panel text-sm font-bold text-primary transition hover:bg-button-hover">M</Link></div>
  </div></header>;
}
