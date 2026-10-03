import type { MetadataRoute } from "next";
import { languages, entryHref } from "@/lib/content";
import { guides } from "@/content/guides";
import { snippets } from "@/content/snippets";
import { templates } from "@/content/templates";
import { comparisons } from "@/content/comparisons";
import { recipes } from "@/content/recipes";

const BASE_URL = "https://cheat-dev.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/todos`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/guias`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/snippets`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/templates`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/receitas`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/comparativos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/sql-lab`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/geradores`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/lab`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/vscode`, changeFrequency: "monthly", priority: 0.6 },
  ];
  for (const r of recipes) routes.push({ url: `${BASE_URL}/receitas/${r.slug}`, changeFrequency: "monthly", priority: 0.7 });
  for (const c of comparisons) routes.push({ url: `${BASE_URL}/comparativos/${c.slug}`, changeFrequency: "monthly", priority: 0.7 });

  for (const g of guides) routes.push({ url: `${BASE_URL}/guias/${g.slug}`, changeFrequency: "monthly", priority: 0.6 });
  for (const s of snippets) routes.push({ url: `${BASE_URL}/snippets/${s.slug}`, changeFrequency: "monthly", priority: 0.6 });
  for (const t of templates) routes.push({ url: `${BASE_URL}/templates/${t.slug}`, changeFrequency: "monthly", priority: 0.6 });

  for (const language of languages) {
    routes.push({
      url: `${BASE_URL}/${language.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const category of language.categories) {
      routes.push({
        url: `${BASE_URL}/${language.slug}/${category.slug}`,
        changeFrequency: "weekly",
        priority: 0.6,
      });
      for (const entry of category.entries) {
        routes.push({
          url: `${BASE_URL}${entryHref(language.slug, category.slug, entry.slug)}`,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  }

  return routes;
}
