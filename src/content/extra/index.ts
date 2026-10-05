import { Category, LangSlug } from "@/lib/types";
import { htmlA } from "@/content/extra/html-1";
import { htmlB } from "@/content/extra/html-2";
import { htmlC } from "@/content/extra/html-3";
import { cssA } from "@/content/extra/css-1";
import { cssB } from "@/content/extra/css-2";
import { cssC } from "@/content/extra/css-3";
import { cssD } from "@/content/extra/css-4";
import { jsA } from "@/content/extra/js-1";
import { jsB } from "@/content/extra/js-2";
import { jsC } from "@/content/extra/js-3";
import { sqlA } from "@/content/extra/sql-1";
import { sqlB } from "@/content/extra/sql-2";
import { sqlC } from "@/content/extra/sql-3";
import { sqlD } from "@/content/extra/sql-4";

export const EXTRA: Record<LangSlug, Category[]> = {
  html: [...htmlA, ...htmlB, ...htmlC],
  css: [...cssA, ...cssB, ...cssC, ...cssD],
  js: [...jsA, ...jsB, ...jsC],
  sql: [...sqlA, ...sqlB, ...sqlC, ...sqlD],
};
