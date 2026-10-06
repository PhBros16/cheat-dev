// Extrai os exemplos de JavaScript dos lotes novos. Uso: npx tsx scripts/validate/js-examples.mts && node scripts/validate/js-examples-run.mjs
import fs from "fs";
const { languages } = await import("@/lib/content");
const NEW = ["datas", "colecoes", "regex", "tipos-coercao", "eventos-modulos", "web-apis", "assincrono-pro"]; // ajuste ao validar outros lotes
const list: { id: string; code: string }[] = [];
for (const c of languages.find((l) => l.slug === "js")!.categories) if (NEW.includes(c.slug)) for (const e of c.entries) list.push({ id: `${c.slug}/${e.slug}`, code: e.examples?.[0]?.code ?? "" });
fs.writeFileSync("/tmp/val/js-examples.json", JSON.stringify(list));
console.log(list.length, "exemplos exportados");
