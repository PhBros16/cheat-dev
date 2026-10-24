// Varre TODAS as mini-aulas: nada de marcação sobrando (crases, **) no texto renderizado e blocos de código balanceados. Uso: npx tsx scripts/validate/learn-render.mts
const { CHALLENGES } = await import("@/content/challenges"); const { parseBlocks, parseInline } = await import("@/lib/learnParse");
const flat = (toks: any[]): string => toks.map((t) => (t.k === "b" ? flat(t.c) : t.s)).join("");
let bad = 0, paragraphs = 0, blocks = 0;
const say = (id: string, m: string) => { bad++; console.log("✗", id + ":", m); };
// o interpretador em si
const t1 = parseInline("O **`switch`** e `x` e **negrito** `a * b`"); if (JSON.stringify(t1.map((t: any) => t.k)) !== JSON.stringify(["text", "b", "text", "code", "text", "b", "text", "code"])) say("(parser)", "tokens inesperados: " + JSON.stringify(t1.map((t: any) => t.k)));
if (flat(parseInline("**`a * b`**")) !== "a * b") say("(parser)", "negrito com código e * dentro");
for (const c of CHALLENGES as any[]) {
  const l: string = c.learn; if (!l) { say(c.id, "sem mini-aula"); continue; }
  if ((l.match(/```/g) || []).length % 2) say(c.id, "cerca ``` desbalanceada");
  for (const b of parseBlocks(l)) {
    if (b.k === "pre") { blocks++; if (!b.s.trim()) say(c.id, "bloco de código vazio"); continue; }
    paragraphs++;
    const out = flat(parseInline(b.s));
    if (/`/.test(out)) say(c.id, "crase sobrando no texto: …" + out.slice(Math.max(0, out.indexOf("`") - 25), out.indexOf("`") + 25) + "…");
    if (/\*\*/.test(out)) say(c.id, "** sobrando: …" + out.slice(Math.max(0, out.indexOf("**") - 25), out.indexOf("**") + 25) + "…");
  }
}
console.log(`${(CHALLENGES as any[]).length} mini-aulas, ${paragraphs} parágrafos, ${blocks} blocos de código | problemas: ${bad}`); process.exit(bad ? 1 : 0);
