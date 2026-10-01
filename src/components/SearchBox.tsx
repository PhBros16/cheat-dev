"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Doc, searchDocs } from "@/lib/search";
import { loadDocs } from "@/lib/searchIndex";
import { langStyles } from "@/lib/langStyles";

const EXAMPLES = [
  "borda embaixo",
  "margem na direita",
  "transição de cor",
  "centralizar div",
  "remover item do array",
  "juntar duas tabelas",
  "esconder elemento",
  "campo de senha",
  "sombra no texto",
  "ordenar por data",
];

export default function SearchBox({ variant = "compact" }: { variant?: "hero" | "compact" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [ex, setEx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isHero = variant === "hero";

  const results = useMemo(
    () => searchDocs(docs, query, isHero ? 10 : 8),
    [docs, query, isHero]
  );

  useEffect(() => {
    loadDocs().then(setDocs).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isHero) return;
    const id = setInterval(() => setEx((n) => (n + 1) % EXAMPLES.length), 2800);
    return () => clearInterval(id);
  }, [isHero]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && e.shiftKey && query.trim()) {
      e.preventDefault();
      go(`/busca?q=${encodeURIComponent(query.trim())}`);
      return;
    }
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]?.href ?? results[0].href);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-3 rounded-2xl border border-border bg-surface transition-shadow focus-within:shadow-lg ${
          isHero ? "px-5 py-4" : "px-3.5 py-2"
        }`}
      >
        <svg width={isHero ? 20 : 16} height={isHero ? 20 : 16} viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          type="text"
          aria-label="Buscar comandos"
          autoComplete="off"
          placeholder={isHero ? `Descreva o que quer fazer… ex: ${EXAMPLES[ex]}` : "Buscar… (/)"}
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
        <div className={`absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-xl ${isHero ? "text-base" : "text-sm"}`}>
          <ul className="max-h-[60vh] overflow-y-auto">
            {results.map((r, i) => {
              const style = langStyles[r.lang];
              return (
                <li key={r.href}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(r.href)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${i === active ? "bg-surface-muted" : ""}`}
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono font-medium text-foreground">{r.title}</span>
                      <span className="block truncate text-xs text-muted">{r.summary}</span>
                    </span>
                    <span className={`shrink-0 text-xs font-medium ${style.text}`}>{r.langTitle}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => go(`/busca?q=${encodeURIComponent(query.trim())}`)}
            className="w-full border-t border-border px-4 py-2 text-left text-xs text-muted hover:bg-surface-muted hover:text-foreground"
          >
            Ver todos os resultados para &ldquo;{query}&rdquo; <span className="opacity-60">(Shift+Enter)</span>
          </button>
        </div>
      )}

      {open && query.trim() && docs.length > 0 && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-6 text-center text-sm text-muted shadow-xl">
          Nada encontrado para &ldquo;{query}&rdquo;. Tente descrever de outro jeito, tipo &ldquo;borda embaixo&rdquo; ou &ldquo;transição de cor&rdquo;.
        </div>
      )}
    </div>
  );
}
