// Integridade do catálogo de desafios e das trilhas. Uso: npx tsx scripts/validate/integrity.mts
const { CHALLENGES } = await import("@/content/challenges");
const { TRACKS } = await import("@/content/tracks");
const { HTML_NEW } = await import("@/content/ch-html"); const { CSS_NEW } = await import("@/content/ch-css");
const { JS_NEW } = await import("@/content/ch-js"); const { SQL_NEW } = await import("@/content/ch-sql");
const NEW = new Set([...HTML_NEW, ...CSS_NEW, ...JS_NEW, ...SQL_NEW].map((c: any) => c.id));
const bad: string[] = []; const warn: string[] = [];
const ids = CHALLENGES.map((c: any) => c.id);
const dup = ids.filter((id: string, i: number) => ids.indexOf(id) !== i); if (dup.length) bad.push("ids duplicados: " + [...new Set(dup)].join(", "));
const byId = new Map(CHALLENGES.map((c: any) => [c.id, c] as [string, any]));
const seen = new Map<string, string>();
for (const t of TRACKS) {
  if (!t.ids.length) bad.push(`trilha ${t.id} vazia`);
  for (const id of t.ids) {
    const c = byId.get(id);
    if (!c) { bad.push(`trilha ${t.id}: desafio inexistente "${id}"`); continue; }
    if (c.lang !== t.lang) bad.push(`trilha ${t.id} (${t.lang}) contém ${id} que é ${c.lang}`);
    if (seen.has(id)) bad.push(`"${id}" está em duas trilhas: ${seen.get(id)} e ${t.id}`); seen.set(id, t.id);
  }
}
for (const c of CHALLENGES as any[]) if (!seen.has(c.id)) bad.push(`"${c.id}" não está em nenhuma trilha`);
const LV = ["iniciante", "intermediário", "avançado", "chefe"];
for (const c of CHALLENGES as any[]) {
  if (!c.title?.trim() || c.brief.trim().length < 20 || c.hint.trim().length < 8) bad.push(`${c.id}: título/enunciado/dica curtos demais`);
  if (c.kind === "web") {
    if (c.tests.length < 2) bad.push(`${c.id}: menos de 2 testes`);
    const names = c.tests.map((t: any) => t.name); if (new Set(names).size !== names.length) bad.push(`${c.id}: nomes de teste repetidos`);
    if (JSON.stringify(c.starter) === JSON.stringify(c.solution)) bad.push(`${c.id}: starter igual à solução`);
  }
  if (NEW.has(c.id) && (!c.learn || c.learn.trim().length < 60)) bad.push(`${c.id}: mini-aula (learn) ausente ou curta (< 60 caracteres)`);
}
for (const t of TRACKS) { // dentro da trilha o nível não deve despencar (aviso)
  let max = -1; for (const id of t.ids) { const c = byId.get(id); if (!c) continue; const l = LV.indexOf(c.level); if (l < max - 1) warn.push(`${t.id}: ${id} (${c.level}) vem depois de nível bem mais alto`); max = Math.max(max, l); }
}
const n = (l: string) => CHALLENGES.filter((c: any) => c.lang === l).length;
console.log(`desafios: ${CHALLENGES.length} (HTML ${n("html")} · CSS ${n("css")} · JS ${n("js")} · SQL ${n("sql")}) | trilhas: ${TRACKS.length} | novos com mini-aula: ${[...NEW].length}`);
for (const w of warn) console.log("aviso:", w);
console.log(bad.length ? `PROBLEMAS (${bad.length}):\n` + bad.slice(0, 40).map((b) => " - " + b).join("\n") + (bad.length > 40 ? `\n ... e mais ${bad.length - 40}` : "") : "integridade OK");
process.exit(bad.length ? 1 : 0);
