"use client";

import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import ThemeToggle from "@/components/ThemeToggle";
import { setNavOpen, useNavOpen } from "@/lib/store";

const LINKS = [
  { href: "/guias", label: "Guias" },
  { href: "/snippets", label: "Snippets" },
  { href: "/templates", label: "Templates" },
  { href: "/todos", label: "Comandos" },
];

export default function TopBar() {
  const open = useNavOpen();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => setNavOpen(!open)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            cheat<span className="text-html">/</span>dev
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-4 md:flex" aria-label="Seções">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-muted hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-2 flex-1">
          <SearchBox variant="compact" />
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
