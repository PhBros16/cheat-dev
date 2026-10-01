import { Category, Entry, PlayKind } from "@/lib/types";

/**
 * Formato compacto para escrever muitos comandos.
 *  s slug · t título · d resumo · x sintaxe · ex exemplo(s) separados por "\n---\n"
 *  k palavras-chave (|) · n notas (\n separa parágrafos) · u use quando (|) · a evite quando (|)
 *  r relacionados (|) · v demo CSS "modo:declarações" · L (JS) exemplo executável · np sem playground
 */
export type Raw = {
  s: string;
  t: string;
  d: string;
  x?: string;
  ex?: string;
  k?: string;
  n?: string;
  u?: string;
  a?: string;
  r?: string;
  v?: string;
  L?: 1;
  np?: 1;
};

const list = (v?: string) =>
  v ? v.split("|").map((i) => i.trim()).filter(Boolean) : undefined;

function make(lang: "html" | "css" | "js" | "sql", o: Raw): Entry {
  let play: PlayKind | undefined;
  let demo: Entry["demo"];
  let ex = o.ex;

  if (lang === "css" && o.v) {
    const i = o.v.indexOf(":");
    demo = { mode: o.v.slice(0, i), css: o.v.slice(i + 1).trim() };
    play = "css";
    if (!ex) {
      const sel = ["f", "g", "c"].includes(demo.mode) ? ".container" : demo.mode === "p" ? "p" : ".elemento";
      const body = demo.css
        .split(";")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => `  ${x};`)
        .join("\n");
      ex = `${sel} {\n${body}\n}`;
    }
  }
  if (lang === "html" && !o.np && ex) play = "html";
  if (lang === "js" && o.L && ex) play = "js";

  return {
    slug: o.s,
    title: o.t,
    summary: o.d,
    syntax: o.x,
    description: o.n ? o.n.split("\n") : [o.d],
    examples: ex ? ex.split("\n---\n").map((c) => ({ code: c.trim() })) : [],
    useWhen: list(o.u),
    avoidWhen: list(o.a),
    related: list(o.r),
    keywords: list(o.k),
    play,
    demo,
  };
}

export const H = (o: Raw) => make("html", o);
export const S = (o: Raw) => make("css", o);
export const J = (o: Raw) => make("js", o);
export const Q = (o: Raw) => make("sql", o);

export const cat = (
  slug: string,
  title: string,
  description: string,
  entries: Entry[]
): Category => ({ slug, title, description, entries });
