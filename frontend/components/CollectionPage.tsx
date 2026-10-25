import Link from "next/link";
import { ArrowLeft, Library, LockKeyhole } from "lucide-react";

type CollectionPageProps = {
  title: string;
  description: string;
  detail: string;
};

export default function CollectionPage({ title, description, detail }: CollectionPageProps) {
  return <div className="mx-auto max-w-3xl"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white"><ArrowLeft size={16} /> Back to discover</Link><section className="surface rounded-2xl px-6 py-16 text-center sm:px-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-coral/10 text-coral"><Library size={25} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-coral">{title}</p><h1 className="mt-2 text-2xl font-bold">{description}</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">{detail}</p><div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-neutral-500"><LockKeyhole size={14} /> Requires a connected Yoohoo account</div><div className="mt-8"><Link href="/" className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white hover:bg-[#ff6262]">Explore videos</Link></div></section></div>;
}
