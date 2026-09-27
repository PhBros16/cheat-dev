import type { MetadataRoute } from "next";
import { languages, entryHref } from "@/lib/content";

const BASE_URL = "https://cheat-dev.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
  ];

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
