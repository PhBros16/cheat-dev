export type LangSlug = "html" | "css" | "js" | "sql";

export type Example = {
  code: string;
  caption?: string;
};

export type Entry = {
  slug: string;
  title: string;
  summary: string;
  syntax?: string;
  description: string[];
  examples: Example[];
  useWhen?: string[];
  avoidWhen?: string[];
  related?: string[]; // "lang/category/slug"
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  entries: Entry[];
};

export type Language = {
  slug: LangSlug;
  title: string;
  short: string;
  tagline: string;
  color: string; // hex
  codeLang: string; // shiki lang id
  categories: Category[];
};

export type SearchItem = {
  lang: LangSlug;
  langTitle: string;
  category: string;
  categoryTitle: string;
  slug: string;
  title: string;
  summary: string;
  href: string;
};
