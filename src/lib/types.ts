export type LangSlug = "html" | "css" | "js" | "sql";

export type PlayKind = "html" | "css" | "js";

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
  /** frases em linguagem natural (pt-BR/en) que levam a este comando na busca */
  keywords?: string[];
  /** tipo de playground ao vivo exibido na página */
  play?: PlayKind;
  /** demo visual para CSS: mode define o cenário, css são as declarações editáveis */
  demo?: { mode: string; css: string };
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
  keywords: string[];
};

/* ---------- Guias, Snippets e Templates ---------- */

export type GuideStep = {
  heading: string;
  text: string[];
  code?: { lang: string; content: string; caption?: string };
  note?: string;
};

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  level: "iniciante" | "intermediário" | "avançado";
  minutes: number;
  tags: string[];
  steps: GuideStep[];
  finalCode?: { lang: PlayKind; content: string; label: string };
};

export type Snippet = {
  slug: string;
  title: string;
  description: string;
  category: string;
  code: string;
};

export type SiteTemplate = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  code: string;
};
