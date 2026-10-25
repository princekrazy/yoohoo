"use client";

import Link from "next/link";
import { Clapperboard, History, Home, Library, Menu, ThumbsUp, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = [[Home, "Home", "/"], [Users, "Subscriptions", "/subscriptions"], [History, "History", "/history"], [ThumbsUp, "Liked videos", "/liked"], [Library, "Library", "/library"]] as const;

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const wasDesktop = useRef(false);

  useEffect(() => {
    const syncViewport = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop !== wasDesktop.current) setOpen(isDesktop);
      wasDesktop.current = isDesktop;
    };
    syncViewport();
    window.addEventListener("resize", syncViewport, { passive: true });
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  return <aside className={`fixed left-0 top-[72px] z-40 h-[calc(100vh-72px)] bg-[#18191B] transition-[width,transform] duration-200 ease-out will-change-[width] lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:shrink-0 ${open ? "w-60" : "w-14"}`}>
    <nav className="flex h-full flex-col gap-1 px-2 pt-3">
      <button onClick={() => setOpen(!open)} aria-label={open ? "Collapse sidebar" : "Open sidebar"} title={open ? "Collapse sidebar" : "Open sidebar"} className={`mb-3 flex h-10 items-center rounded-lg text-neutral-300 transition hover:bg-button-hover hover:text-primary ${open ? "w-full justify-start px-3" : "w-10 justify-center"}`}>
        {open ? <X size={19} /> : <Menu size={20} />}
        {open && <span className="ml-3 text-sm font-medium">Menu</span>}
      </button>
      {links.map(([Icon, label, href]) => <Link key={label} href={href} title={label} className={`reference-pill flex items-center gap-4 px-3 py-3 text-sm text-neutral-400 ${open ? "" : "justify-center"}`}><Icon size={19} />{open && label}</Link>)}
      <Link href="/upload" title="Creator studio" className={`reference-pill flex items-center gap-4 px-3 py-3 text-sm text-neutral-400 ${open ? "" : "justify-center"}`}><Clapperboard size={19} />{open && "Creator studio"}</Link>
    </nav>
  </aside>;
}
