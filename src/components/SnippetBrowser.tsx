"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import LazyPreview from "@/components/LazyPreview";

type Item = { slug: string; title: string; description: string; category: string; code: string };

export default function SnippetBrowser({ items, basePath, noun }: { items: Item[]; basePath: string; noun: string }) {
  const cats = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const [cat, setCat] = useState("todos");
  const [q, setQ] = useState("");

  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const shown = items.filter((i) => (cat === "todos" || i.category === cat) && (!q || norm(`${i.title} ${i.description} ${i.category}`).includes(norm(q))));

  const tab = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:text-foreground"}`;

  return (
    <div>
      <div className="sticky top-[57px] z-10 -mx-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-16 lg:px-16">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categorias">
          <button role="tab" aria-selected={cat === "todos"} className={tab(cat === "todos")} onClick={() => setCat("todos")}>Todos ({items.length})</button>
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={tab(cat === c)} onClick={() => setCat(c)}>
              {c} ({items.filter((i) => i.category === c).length})
            </button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Filtrar ${noun}…`} className="mt-2 w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground" />
      </div>

      <p className="mt-4 text-sm text-muted">{shown.length} {noun}</p>
      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((s) => (
          <Link key={s.slug} href={`${basePath}/${s.slug}`} className="block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-css">
            <div className="pointer-events-none h-44 overflow-hidden border-b border-border"><LazyPreview doc={s.code} height={176} /></div>
            <div className="p-4">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{s.category}</span>
              <p className="mt-1 font-semibold text-foreground">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </div>
          </Link>
        ))}
      </div>
      {shown.length === 0 && <p className="mt-10 text-center text-muted">Nada encontrado. Tente outra palavra ou categoria.</p>}
    </div>
  );
}
