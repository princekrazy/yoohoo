import Link from "next/link";
import { ArrowLeft, Library, LockKeyhole } from "lucide-react";

type CollectionPageProps = {
  title: string;
  description: string;
  detail: string;
};

export default function CollectionPage({ title, description, detail }: CollectionPageProps) {
  return <div className="mx-auto max-w-3xl"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-primary"><ArrowLeft size={16} /> Back to discover</Link><section className="surface rounded-2xl px-6 py-16 text-center sm:px-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-button text-secondary"><Library size={25} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-secondary">{title}</p><h1 className="mt-2 text-2xl font-bold">{description}</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{detail}</p><div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-panel px-4 py-2 text-xs text-muted"><LockKeyhole size={14} /> Requires a connected Yoohoo account</div><div className="mt-8"><Link href="/" className="rounded-lg bg-button px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-button-hover">Explore videos</Link></div></section></div>;
}
