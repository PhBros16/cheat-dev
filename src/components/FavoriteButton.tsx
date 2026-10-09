"use client";

import { Saved, toggleFav, useSaved } from "@/lib/store";

export default function FavoriteButton({ item }: { item: Saved }) {
  const favs = useSaved("fav");
  const on = favs.some((f) => f.href === item.href);
  return (
    <button
      type="button"
      onClick={() => toggleFav(item)}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        on ? "border-js text-js-fg" : "border-border text-muted hover:text-foreground"
      }`}
    >
      <span aria-hidden>{on ? "★" : "☆"}</span>
      {on ? "Nos favoritos" : "Favoritar"}
    </button>
  );
}
