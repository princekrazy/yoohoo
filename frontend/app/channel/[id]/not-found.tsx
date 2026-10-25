import Link from "next/link";
export default function NotFound() { return <div className="mx-auto max-w-lg py-24 text-center"><h1 className="text-3xl font-bold">Channel not found</h1><p className="mt-3 text-muted">This creator may not have joined Yoohoo yet.</p><Link href="/" className="mt-6 inline-block text-sm font-semibold text-secondary hover:text-primary">Return home</Link></div>; }
