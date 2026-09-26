import { LangSlug } from "@/lib/types";

type LangStyle = {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  hoverBorder: string;
  ring: string;
  dot: string;
};

export const langStyles: Record<LangSlug, LangStyle> = {
  html: {
    text: "text-html",
    bg: "bg-html",
    bgSoft: "bg-html/10",
    border: "border-html",
    hoverBorder: "hover:border-html",
    ring: "focus-visible:ring-html",
    dot: "bg-html",
  },
  css: {
    text: "text-css",
    bg: "bg-css",
    bgSoft: "bg-css/10",
    border: "border-css",
    hoverBorder: "hover:border-css",
    ring: "focus-visible:ring-css",
    dot: "bg-css",
  },
  js: {
    text: "text-js",
    bg: "bg-js",
    bgSoft: "bg-js/10",
    border: "border-js",
    hoverBorder: "hover:border-js",
    ring: "focus-visible:ring-js",
    dot: "bg-js",
  },
  sql: {
    text: "text-sql",
    bg: "bg-sql",
    bgSoft: "bg-sql/10",
    border: "border-sql",
    hoverBorder: "hover:border-sql",
    ring: "focus-visible:ring-sql",
    dot: "bg-sql",
  },
};
