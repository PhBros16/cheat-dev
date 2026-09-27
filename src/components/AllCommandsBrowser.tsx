"use client";

import { useMemo, useState } from "react";
import EntryCard from "@/components/EntryCard";
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

  const filtered = useMemo(
    () => (filter === "all" ? index : index.filter((item) => item.lang === filter)),
    [filter, index]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.slug;
          const style = f.slug !== "all" ? langStyles[f.slug] : null;
          return (
            <button
              key={f.slug}
              type="button"
              onClick={() => setFilter(f.slug)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? `border-current ${style ? style.text : "text-foreground"} ${style ? style.bgSoft : "bg-surface-muted"}`
                  : "border-border text-muted hover:text-foreground"
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
