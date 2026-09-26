"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildSearchIndex } from "@/lib/content";
import { searchIndex } from "@/lib/search";
import { langStyles } from "@/lib/langStyles";
import { LangSlug } from "@/lib/types";

const INDEX = buildSearchIndex();

export default function SearchBox({
  variant = "compact",
}: {
  variant?: "hero" | "compact";
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = searchIndex(INDEX, query, variant === "hero" ? 10 : 8);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActive(0);
  }

  function go(href: string) {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active].href);
    }
  }

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-3 rounded-2xl border border-border bg-surface transition-shadow focus-within:shadow-lg ${
          isHero ? "px-5 py-4" : "px-3.5 py-2"
        }`}
      >
        <svg
          width={isHero ? 20 : 16}
          height={isHero ? 20 : 16}
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-muted"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder={
            isHero
              ? "Qual comando você está procurando? Ex: flexbox, map, JOIN..."
              : "Buscar..."
          }
          className={`w-full bg-transparent text-foreground outline-none placeholder:text-muted ${
            isHero ? "text-lg" : "text-sm"
          }`}
        />
        {!isHero && (
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
            ⌘K
          </kbd>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          className={`absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-xl ${
            isHero ? "text-base" : "text-sm"
          }`}
        >
          {results.map((r, i) => {
            const style = langStyles[r.lang as LangSlug];
            return (
              <li key={r.href}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(r.href)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    i === active ? "bg-surface-muted" : ""
                  }`}
                >
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono font-medium text-foreground">
                      {r.title}
                    </span>
                    <span className="block truncate text-xs text-muted">{r.summary}</span>
                  </span>
                  <span className={`shrink-0 text-xs font-medium ${style.text}`}>
                    {r.langTitle}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-6 text-center text-sm text-muted shadow-xl">
          Nada encontrado para &ldquo;{query}&rdquo; — ainda. Bora adicionar?
        </div>
      )}
    </div>
  );
}
