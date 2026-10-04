import { languages } from "@/lib/content";
import { comparisons } from "@/content/comparisons";
import { guides } from "@/content/guides";
import { recipes } from "@/content/recipes";

export type ResolvedLink = { label: string; href: string; kind: string };

const ROUTES: Record<string, string> = {
  "/lab": "Lab (testar código)",
  "/sql-lab": "SQL Lab",
  "/geradores": "Geradores de CSS",
  "/vscode": "Atalhos do VS Code",
  "/receitas": "Receitas",
  "/desafios": "Desafios",
};

let index: Map<string, ResolvedLink> | null = null;

function build() {
  const m = new Map<string, ResolvedLink>();
  for (const l of languages) for (const c of l.categories) for (const e of c.entries) {
    const k = `${l.slug}:${e.slug}`;
    if (!m.has(k)) m.set(k, { label: e.title, href: `/${l.slug}/${c.slug}/${e.slug}`, kind: l.title });
  }
  return m;
}

/** Converte "lang:slug" ou "/rota" em rótulo e endereço reais. Devolve null se não existir (a página não quebra). */
export function resolveLink(token: string): ResolvedLink | null {
  if (token.startsWith("/")) {
    if (ROUTES[token]) return { label: ROUTES[token], href: token, kind: "Ferramenta" };
    const [, area, slug] = token.split("/");
    if (area === "comparativos") { const c = comparisons.find((x) => x.slug === slug); return c ? { label: c.title, href: token, kind: "Comparativo" } : null; }
    if (area === "guias") { const g = guides.find((x) => x.slug === slug); return g ? { label: g.title, href: token, kind: "Guia" } : null; }
    if (area === "receitas") { const r = recipes.find((x) => x.slug === slug); return r ? { label: r.title, href: token, kind: "Receita" } : null; }
    return null;
  }
  index ??= build();
  return index.get(token) ?? null;
}
