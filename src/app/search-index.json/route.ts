import { buildSearchIndex } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const rows = buildSearchIndex().map((i) => ({
    l: i.lang,
    lt: i.langTitle,
    c: i.category,
    ct: i.categoryTitle,
    s: i.slug,
    t: i.title,
    d: i.summary,
    k: i.keywords.join("|"),
  }));
  return Response.json(rows);
}
