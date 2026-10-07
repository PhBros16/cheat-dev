import Link from "next/link";
import { languages, entryHref, countEntries } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";
import SidebarActive from "@/components/SidebarActive";

const chevron = (
  <svg className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none">
    <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type IconProps = { children: React.ReactNode };

function Icon({ children }: IconProps) {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-muted group-hover/item:text-foreground"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ICONS = {
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01M12 12h.01" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3" />
      <path d="M7.5 14h9" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  recipe: (
    <>
      <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
      <path d="M6 6h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  compare: <path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />,
  book: <path d="M2 5.5C4 4.5 7 4.5 12 7c5-2.5 8-2.5 10-1.5v13c-2-1-5-1-10 1.5-5-2.5-8-2.5-10-1.5zM12 7v13" />,
  code: <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />,
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
    </>
  ),
  bookmark: <path d="M6 4h12v17l-6-4-6 4z" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
};

const SECTIONS = [
  { href: "/essencial", label: "Essencial", icon: ICONS.star },
  { href: "/desafios", label: "Desafios", icon: ICONS.dice },
  { href: "/lab", label: "Lab", icon: ICONS.flask },
  { href: "/sql-lab", label: "SQL Lab", icon: ICONS.database },
  { href: "/geradores", label: "Geradores de CSS", icon: ICONS.sliders },
  { href: "/receitas", label: "Receitas", icon: ICONS.recipe },
  { href: "/comparativos", label: "Comparativos", icon: ICONS.compare },
  { href: "/guias", label: "Guias e tutoriais", icon: ICONS.book },
  { href: "/snippets", label: "Snippets", icon: ICONS.code },
  { href: "/templates", label: "Templates", icon: ICONS.layout },
  { href: "/vscode", label: "Atalhos do VS Code", icon: ICONS.keyboard },
  { href: "/favoritos", label: "Favoritos", icon: ICONS.bookmark },
];

const linkClass =
  "group/item flex items-center gap-2.5 rounded-lg px-2 py-1.5 font-medium text-foreground hover:bg-surface-muted";

export default function Sidebar() {
  return (
    <nav aria-label="Navegação" data-sidebar className="px-3 py-5 text-sm">
      <SidebarActive />

      <div className="mb-4 flex flex-col gap-0.5 border-b border-border pb-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={linkClass}
          >
            <Icon>{s.icon}</Icon>
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

      <div className="mt-4 border-t border-border pt-4">
        <Link href="/todos" className={linkClass}>
          <Icon>{ICONS.list}</Icon>
          Todos os comandos
        </Link>
      </div>
    </nav>
  );
}
