import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = { title: "Yoohoo — Share what moves you", description: "A video-sharing platform for human-made stories.", icons: { icon: "/yoohoo-logo.svg" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="page-shell"><Navbar /><div className="mx-auto flex max-w-[1600px]"><Sidebar /><main className="min-w-0 flex-1 px-[clamp(1rem,3vw,2rem)] pb-16 pt-[clamp(1rem,2vw,1.25rem)]">{children}</main></div></div></body></html>;
}
