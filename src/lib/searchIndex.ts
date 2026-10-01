import { buildDocs, Doc } from "@/lib/search";
import { LangSlug, SearchItem } from "@/lib/types";

type Compact = { l: LangSlug; lt: string; c: string; ct: string; s: string; t: string; d: string; k: string };

let cached: Promise<Doc[]> | null = null;

/** Carrega o índice leve (JSON estático) uma única vez. */
export function loadDocs(): Promise<Doc[]> {
  if (!cached) {
    cached = fetch("/search-index.json")
      .then((r) => r.json() as Promise<Compact[]>)
      .then((rows) =>
        buildDocs(
          rows.map(
            (r): SearchItem => ({
              lang: r.l,
              langTitle: r.lt,
              category: r.c,
              categoryTitle: r.ct,
              slug: r.s,
              title: r.t,
              summary: r.d,
              href: `/${r.l}/${r.c}/${r.s}`,
              keywords: r.k ? r.k.split("|") : [],
            })
          )
        )
      )
      .catch((e) => {
        cached = null;
        throw e;
      });
  }
  return cached;
}
