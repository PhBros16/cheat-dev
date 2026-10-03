import Link from "next/link";
import { languages, entryHref, countEntries } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";
import SidebarActive from "@/components/SidebarActive";

const chevron = (
  <svg className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none">
    <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SECTIONS = [
  { href: "/lab", label: "🧪 Lab (testar código)" },
  { href: "/geradores", label: "🎛 Geradores de CSS" },
  { href: "/receitas", label: "Receitas (como fazer)" },
  { href: "/comparativos", label: "Comparativos" },
  { href: "/guias", label: "Guias e tutoriais" },
  { href: "/snippets", label: "Snippets prontos" },
  { href: "/templates", label: "Templates de site" },
  { href: "/vscode", label: "Atalhos do VS Code" },
  { href: "/favoritos", label: "★ Favoritos" },
  { href: "/todos", label: "Todos os comandos" },
];

export default function Sidebar() {
  return (
    <nav aria-label="Navegação" data-sidebar className="px-3 py-5 text-sm">
      <SidebarActive />

      <div className="mb-4 flex flex-col gap-0.5 border-b border-border pb-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg px-2 py-1.5 font-medium text-foreground hover:bg-surface-muted"
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {languages.map((lang) => {
          const st = langStyles[lang.slug];
          return (
            <details key={lang.slug} data-lang={lang.slug} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-1.5 font-display font-semibold text-foreground hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
                <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                {lang.title}
                <span className="ml-auto text-xs font-normal text-muted">{countEntries(lang)}</span>
                {chevron}
              </summary>
              <div className="ml-3.5 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                <Link href={`/${lang.slug}`} className="nav-link rounded-md px-2 py-1 text-[13px] text-muted hover:text-foreground">
                  Visão geral
                </Link>
                {lang.categories.map((c) => (
                  <details key={c.slug} data-cat={`${lang.slug}/${c.slug}`} className="group">
                    <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">{c.title}</span>
                      <span className="text-[10px] font-normal">{c.entries.length}</span>
                      {chevron}
                    </summary>
                    <ul className="mb-1 flex flex-col gap-0.5">
                      {c.entries.map((e) => (
                        <li key={e.slug}>
                          <Link
                            href={entryHref(lang.slug, c.slug, e.slug)}
                            className="nav-link block rounded-md px-2 py-1 font-mono text-[13px] leading-snug break-words text-muted hover:text-foreground"
                          >
                            {e.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </nav>
  );
}
