"use client";

import Link from "next/link";
import EntryCard from "@/components/EntryCard";
import { useSaved } from "@/lib/store";

export default function HomeLists() {
  const favs = useSaved("fav");
  const recent = useSaved("recent");
  if (!favs.length && !recent.length) return null;
  return (
    <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-10">
      {favs.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">★ Seus favoritos</h2>
            <Link href="/favoritos" className="text-sm text-muted underline underline-offset-4 hover:text-foreground">ver todos, por linguagem</Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {favs.map((i) => <EntryCard key={i.href} item={i} />)}
          </div>
        </section>
      )}
      {recent.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">Vistos recentemente</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recent.slice(0, 6).map((i) => <EntryCard key={i.href} item={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
