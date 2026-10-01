import html from "@/content/html";
import css from "@/content/css";
import js from "@/content/js";
import sql from "@/content/sql";
import { EXTRA } from "@/content/extra";
import { OLD_KEYWORDS } from "@/content/extra/keywords";
import { Language, LangSlug, SearchItem, Entry, Category } from "@/lib/types";

const splitKw = (v?: string) => (v ? v.split("|").map((x) => x.trim()).filter(Boolean) : []);

function build(): Language[] {
  return [html, css, js, sql].map((lang) => {
    const cats: Category[] = lang.categories.map((c) => ({
      ...c,
      entries: c.entries.map((e) => ({
        ...e,
        keywords: [...(e.keywords ?? []), ...splitKw(OLD_KEYWORDS[`${lang.slug}/${c.slug}/${e.slug}`])],
      })),
    }));
    for (const ex of EXTRA[lang.slug]) {
      const found = cats.find((c) => c.slug === ex.slug);
      if (found) {
        const have = new Set(found.entries.map((e) => e.slug));
        found.entries.push(...ex.entries.filter((e) => !have.has(e.slug)));
      } else {
        cats.push({ ...ex, entries: [...ex.entries] });
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
  return items;
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
