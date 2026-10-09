"use client";

import { useMemo, useState } from "react";
import EntryCard from "@/components/EntryCard";
import { buildDocs, searchDocs } from "@/lib/search";
import { langStyles } from "@/lib/langStyles";
import { SearchItem, LangSlug } from "@/lib/types";

const FILTERS: { slug: LangSlug | "all"; label: string }[] = [
  { slug: "all", label: "Todas" },
  { slug: "html", label: "HTML" },
  { slug: "css", label: "CSS" },
  { slug: "js", label: "JavaScript" },
  { slug: "sql", label: "SQL" },
];

export default function AllCommandsBrowser({ index }: { index: SearchItem[] }) {
  const [filter, setFilter] = useState<LangSlug | "all">("all");
  const [q, setQ] = useState("");
  const docs = useMemo(() => buildDocs(index), [index]);

  const filtered = useMemo(() => {
    const base = q.trim() ? searchDocs(docs, q, 1000) : index;
    return filter === "all" ? base : base.filter((i) => i.lang === filter);
  }, [docs, index, q, filter]);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filtrar a lista… ex: borda, array, join"
        aria-label="Filtrar comandos"
        className="w-full max-w-md rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none focus:border-css"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.slug;
          const style = f.slug !== "all" ? langStyles[f.slug] : null;
          return (
            <button
              key={f.slug}
              type="button"
              onClick={() => setFilter(f.slug)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive ? `${style ? `${style.border} ${style.text} ${style.bgSoft}` : "bg-surface-muted text-foreground"}` : "border-border text-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto self-center text-sm text-muted">
          {filtered.length} comando{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <EntryCard key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}
