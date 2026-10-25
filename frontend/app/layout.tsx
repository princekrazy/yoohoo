import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = { title: "Yoohoo — Share what moves you", description: "A video-sharing platform for human-made stories." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="page-shell"><Navbar /><div className="mx-auto flex max-w-[1600px]"><Sidebar /><main className="min-w-0 flex-1 px-4 pb-16 pt-5 sm:px-6 lg:px-8">{children}</main></div></div>;
}
