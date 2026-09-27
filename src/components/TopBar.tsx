"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import ThemeToggle from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar";

export default function TopBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
          aria-label="Abrir menu"
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

        <Link
          href="/todos"
          className="hidden shrink-0 text-sm font-medium text-muted hover:text-foreground sm:block"
        >
          Todos os comandos
        </Link>

        <div className="ml-2 flex-1">
          <SearchBox variant="compact" />
        </div>

        <ThemeToggle />
      </div>

      {mobileOpen && (
        <div className="border-t border-border lg:hidden">
          <div className="max-h-[70vh] overflow-y-auto" onClick={() => setMobileOpen(false)}>
            <Sidebar />
          </div>
        </div>
      )}
    </header>
  );
}
