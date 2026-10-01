"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toggleFav, useSaved } from "@/lib/store";
import { langStyles } from "@/lib/langStyles";
import type { LangSlug } from "@/lib/types";

const ORDER: { slug: LangSlug; title: string }[] = [
  { slug: "html", title: "HTML" },
  { slug: "css", title: "CSS" },
  { slug: "js", title: "JavaScript" },
  { slug: "sql", title: "SQL" },
];

export default function FavoritesBrowser() {
  const favs = useSaved("fav");
  const [filter, setFilter] = useState<LangSlug | "all">("all");
  const [sort, setSort] = useState<"az" | "recent">("az");

  const groups = useMemo(
    () =>
      ORDER.map((l) => {
        const items = favs.filter((f) => f.lang === l.slug);
        if (sort === "az") items.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
        return { ...l, items };
      }).filter((g) => g.items.length > 0 && (filter === "all" || filter === g.slug)),
    [favs, filter, sort]
  );

  if (!favs.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        <p className="text-foreground">Nenhum favorito ainda.</p>
        <p className="mt-2 text-sm">
          Abra qualquer comando e clique em <span className="font-semibold">☆ Favoritar</span>. Ele aparece aqui.
        </p>
        <Link href="/todos" className="mt-4 inline-block text-sm font-semibold text-foreground underline underline-offset-4">
          Ver todos os comandos
        </Link>
      </div>
    );
  }

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      active ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:text-foreground"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setFilter("all")} className={chip(filter === "all")}>
          Todos ({favs.length})
        </button>
        {ORDER.map((l) => {
          const n = favs.filter((f) => f.lang === l.slug).length;
          if (!n) return null;
          return (
            <button key={l.slug} onClick={() => setFilter(l.slug)} className={chip(filter === l.slug)}>
              {l.title} ({n})
            </button>
          );
        })}
        <span className="ml-auto flex items-center gap-2 text-sm text-muted">
          Ordem:
          <button onClick={() => setSort("az")} className={chip(sort === "az")}>A–Z</button>
          <button onClick={() => setSort("recent")} className={chip(sort === "recent")}>Mais recentes</button>
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-10">
        {groups.map((g) => {
          const style = langStyles[g.slug];
          return (
            <section key={g.slug}>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                {g.title}
                <span className="text-sm font-normal text-muted">{g.items.length}</span>
              </h2>
              <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
                {g.items.map((i) => (
                  <li key={i.href} className="flex items-center gap-3 px-4 py-3">
                    <Link href={i.href} className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-sm font-semibold text-foreground">{i.title}</span>
                      <span className="block truncate text-sm text-muted">{i.summary}</span>
                    </Link>
                    <button
                      onClick={() => toggleFav(i)}
                      aria-label={`Remover ${i.title} dos favoritos`}
                      className="shrink-0 rounded-md px-2 py-1 text-sm text-muted hover:text-foreground"
                    >
                      ★ Remover
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
