"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import EntryCard from "@/components/EntryCard";
import { Doc, searchDocs } from "@/lib/search";
import { loadDocs } from "@/lib/searchIndex";
import { LangSlug } from "@/lib/types";
import { langStyles } from "@/lib/langStyles";

const FILTERS: { slug: LangSlug | "all"; label: string }[] = [
  { slug: "all", label: "Todas" },
  { slug: "html", label: "HTML" },
  { slug: "css", label: "CSS" },
  { slug: "js", label: "JavaScript" },
  { slug: "sql", label: "SQL" },
];

export default function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [filter, setFilter] = useState<LangSlug | "all">("all");

  useEffect(() => {
    loadDocs().then(setDocs).catch(() => setDocs([]));
  }, []);

  const all = useMemo(() => (docs ? searchDocs(docs, q, 200) : []), [docs, q]);
  const shown = filter === "all" ? all : all.filter((i) => i.lang === filter);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        {q ? <>Resultados para &ldquo;{q}&rdquo;</> : "Busca"}
      </h1>
      <p className="mt-2 text-muted">
        {docs === null ? "Carregando índice…" : `${all.length} resultado${all.length !== 1 ? "s" : ""}`}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f.slug === "all" ? all.length : all.filter((i) => i.lang === f.slug).length;
          const st = f.slug !== "all" ? langStyles[f.slug] : null;
          const active = filter === f.slug;
          return (
            <button
              key={f.slug}
              type="button"
              onClick={() => setFilter(f.slug)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active ? `${st ? `${st.border} ${st.text} ${st.bgSoft}` : "bg-surface-muted text-foreground"}` : "border-border text-muted hover:text-foreground"
              }`}
            >
              {f.label} <span className="font-mono text-[0.85em]">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shown.map((item) => (
          <EntryCard key={item.href} item={item} />
        ))}
      </div>

      {docs && q && shown.length === 0 && (
        <p className="mt-8 text-muted">
          Nada por aqui. Tente palavras como &ldquo;borda&rdquo;, &ldquo;margem&rdquo;, &ldquo;cor&rdquo;, &ldquo;ordenar&rdquo;, &ldquo;remover&rdquo;…
        </p>
      )}
    </div>
  );
}
