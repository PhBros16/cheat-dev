import html from "@/content/html";
import css from "@/content/css";
import js from "@/content/js";
import sql from "@/content/sql";
import { EXTRA } from "@/content/extra";
import { SQL_DEMOS } from "@/content/sql-demos";
import { OLD_KEYWORDS } from "@/content/extra/keywords";
import { Language, LangSlug, SearchItem, Entry, Category } from "@/lib/types";

const splitKw = (v?: string) => (v ? v.split("|").map((x) => x.trim()).filter(Boolean) : []);

const withSql = (lang: string) => (e: Entry): Entry =>
  lang === "sql" && SQL_DEMOS[e.slug] ? { ...e, sql: SQL_DEMOS[e.slug], play: "sql" } : e;

function build(): Language[] {
  return [html, css, js, sql].map((lang) => {
    const cats: Category[] = lang.categories.map((c) => ({
      ...c,
      entries: c.entries.map((e) => ({
        ...e,
        keywords: [...(e.keywords ?? []), ...splitKw(OLD_KEYWORDS[`${lang.slug}/${c.slug}/${e.slug}`])],
        ...(lang.slug === "sql" && SQL_DEMOS[e.slug] ? { sql: SQL_DEMOS[e.slug], play: "sql" as const } : {}),
      })),
    }));
    for (const ex of EXTRA[lang.slug]) {
      const found = cats.find((c) => c.slug === ex.slug);
      if (found) {
        const have = new Set(found.entries.map((e) => e.slug));
        found.entries.push(...ex.entries.filter((e) => !have.has(e.slug)).map(withSql(lang.slug)));
      } else {
        cats.push({ ...ex, entries: ex.entries.map(withSql(lang.slug)) });
      }
    }
    return { ...lang, categories: cats };
  });
}

export const languages: Language[] = build();

export function getLanguage(slug: string): Language | undefined {
  return languages.find((l) => l.slug === slug);
}

export function getCategory(
  langSlug: string,
  categorySlug: string
): { language: Language; category: Category } | undefined {
  const language = getLanguage(langSlug);
  if (!language) return undefined;
  const category = language.categories.find((c) => c.slug === categorySlug);
  if (!category) return undefined;
  return { language, category };
}

export function getEntry(
  langSlug: string,
  categorySlug: string,
  entrySlug: string
): { language: Language; category: Category; entry: Entry } | undefined {
  const found = getCategory(langSlug, categorySlug);
  if (!found) return undefined;
  const entry = found.category.entries.find((e) => e.slug === entrySlug);
  if (!entry) return undefined;
  return { ...found, entry };
}

export function entryHref(lang: LangSlug, category: string, slug: string) {
  return `/${lang}/${category}/${slug}`;
}

export function resolveRelated(refs: string[] | undefined) {
  if (!refs) return [];
  return refs
    .map((ref) => {
      const [lang, category, slug] = ref.split("/");
      const found = getEntry(lang, category, slug);
      if (!found) return null;
      return {
        title: found.entry.title,
        summary: found.entry.summary,
        href: entryHref(found.language.slug, category, slug),
        color: found.language.color,
        langTitle: found.language.title,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

import { recipes } from "@/content/recipes";
import { comparisons } from "@/content/comparisons";
import { guides } from "@/content/guides";
import { snippets } from "@/content/snippets";
import { templates } from "@/content/templates";

/** Receitas, comparativos, guias, snippets e templates entram na busca como itens com link próprio. */
function extraSearchItems(): SearchItem[] {
  const pick = (tags: string[]): LangSlug =>
    (["sql", "js", "css", "html"] as LangSlug[]).find((l) => tags.includes(l) || tags.includes(l === "js" ? "javascript" : l)) ?? "html";
  const mk = (kind: string, cat: string, slug: string, lang: LangSlug, title: string, summary: string, href: string, extra: string[]): SearchItem => ({
    lang, langTitle: kind, category: cat, categoryTitle: kind, slug, title, summary, href, keywords: extra,
  });
  return [
    ...recipes.map((r) => mk("Receita", "receitas", r.slug, pick(r.tags), r.title, r.summary, `/receitas/${r.slug}`, [...r.tags, "como fazer", "tutorial", "receita"])),
    ...comparisons.map((c) => mk("Comparativo", "comparativos", c.slug, c.lang, c.title, c.summary, `/comparativos/${c.slug}`, [...c.tags, "diferença", "diferenca entre", "versus", "vs", "comparar", "qual usar"])),
    ...guides.map((g) => mk("Guia", "guias", g.slug, pick(g.tags), g.title, g.summary, `/guias/${g.slug}`, [...g.tags, "passo a passo", "tutorial"])),
    ...snippets.map((x) => mk("Snippet", "snippets", x.slug, "css", x.title, x.description, `/snippets/${x.slug}`, [x.category, "componente", "pronto", "copiar e colar", "exemplo"])),
    ...templates.map((t) => mk("Template", "templates", t.slug, "html", t.title, t.description, `/templates/${t.slug}`, [...t.tags, "site completo", "modelo", "layout"])),
  ];
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const language of languages) {
    for (const category of language.categories) {
      for (const entry of category.entries) {
        items.push({
          lang: language.slug,
          langTitle: language.title,
          category: category.slug,
          categoryTitle: category.title,
          slug: entry.slug,
          title: entry.title,
          summary: entry.summary,
          href: entryHref(language.slug, category.slug, entry.slug),
          keywords: entry.keywords ?? [],
        });
      }
    }
  }
  return [...items, ...extraSearchItems()];
}

export function countEntries(language: Language) {
  return language.categories.reduce((sum, c) => sum + c.entries.length, 0);
}

export function totalEntries() {
  return languages.reduce((sum, l) => sum + countEntries(l), 0);
}

/** Recorte curado para a home. */
export function popularEntries(): SearchItem[] {
  const picks: [string, string, string][] = [
    ["css", "layout", "display-flex"],
    ["js", "async-dom", "fetch"],
    ["sql", "consultas", "select-where"],
    ["html", "formularios", "input"],
    ["js", "arrays-strings", "map"],
    ["css", "selecao", "custom-properties"],
    ["sql", "avancado", "group-by-having"],
    ["html", "estrutura", "section"],
  ];
  const index = buildSearchIndex();
  return picks
    .map(([lang, category, slug]) =>
      index.find((i) => i.lang === lang && i.category === category && i.slug === slug)
    )
    .filter((x): x is SearchItem => Boolean(x));
}
