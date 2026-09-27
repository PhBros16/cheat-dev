"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { languages, entryHref } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";
import { LangSlug } from "@/lib/types";

export default function Sidebar() {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1];

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6 text-sm">
      {languages.map((language) => {
        const style = langStyles[language.slug];
        const isCurrentLang = currentLang === language.slug;
        return (
          <div key={language.slug}>
            <Link
              href={`/${language.slug}`}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 font-display font-semibold transition-colors ${
                isCurrentLang ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${style.dot}`} />
              {language.title}
            </Link>

            <div className="ml-3.5 mt-1 flex flex-col gap-3 border-l border-border pl-3.5">
              {language.categories.map((category) => (
                <CategoryGroup
                  key={category.slug}
                  langSlug={language.slug}
                  categorySlug={category.slug}
                  title={category.title}
                  entries={category.entries}
                  pathname={pathname}
                  activeColorClass={style.text}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function CategoryGroup({
  langSlug,
  categorySlug,
  title,
  entries,
  pathname,
  activeColorClass,
}: {
  langSlug: string;
  categorySlug: string;
  title: string;
  entries: { slug: string; title: string }[];
  pathname: string;
  activeColorClass: string;
}) {
  const categoryHref = `/${langSlug}/${categorySlug}`;
  const isOpenByDefault = pathname.startsWith(categoryHref);
  const [open, setOpen] = useState(isOpenByDefault);

  return (
    <div>
      <div className="flex w-full items-center justify-between gap-1 text-xs font-medium uppercase tracking-wide text-muted">
        <Link href={categoryHref} className="truncate hover:text-foreground hover:underline">
          {title}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Recolher categoria" : "Expandir categoria"}
          aria-expanded={open}
          className="shrink-0 rounded p-1 hover:text-foreground"
        >
          <span className={`block transition-transform ${open ? "rotate-90" : ""}`}>›</span>
        </button>
      </div>
      {open && (
        <ul className="mt-1.5 flex flex-col gap-1">
          {entries.map((entry) => {
            const href = entryHref(langSlug as LangSlug, categorySlug, entry.slug);
            const isActive = pathname === href;
            return (
              <li key={entry.slug}>
                <Link
                  href={href}
                  className={`block rounded-md px-2 py-1 font-mono text-[13px] leading-snug break-words transition-colors ${
                    isActive
                      ? `${activeColorClass} bg-surface-muted`
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {entry.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
