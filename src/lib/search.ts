import { SearchItem } from "@/lib/types";

export function searchIndex(index: SearchItem[], query: string, limit = 8): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = index
    .map((item) => {
      const title = item.title.toLowerCase();
      const summary = item.summary.toLowerCase();
      const category = item.categoryTitle.toLowerCase();
      const lang = item.langTitle.toLowerCase();

      let score = -1;
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 90;
      else if (title.includes(q)) score = 70;
      else if (lang.includes(q)) score = 55;
      else if (category.includes(q)) score = 40;
      else if (summary.includes(q)) score = 20;

      return { item, score };
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);

  return scored;
}
