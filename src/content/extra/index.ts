import { Category, LangSlug } from "@/lib/types";
import { htmlA } from "@/content/extra/html-1";
import { htmlB } from "@/content/extra/html-2";
import { cssA } from "@/content/extra/css-1";
import { cssB } from "@/content/extra/css-2";
import { jsA } from "@/content/extra/js-1";
import { jsB } from "@/content/extra/js-2";
import { sqlA } from "@/content/extra/sql-1";
import { sqlB } from "@/content/extra/sql-2";

export const EXTRA: Record<LangSlug, Category[]> = {
  html: [...htmlA, ...htmlB],
  css: [...cssA, ...cssB],
  js: [...jsA, ...jsB],
  sql: [...sqlA, ...sqlB],
};
