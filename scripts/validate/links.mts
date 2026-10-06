// Confere links "relacionados" dos comandos e os links da trilha Essencial. Uso: npx tsx scripts/validate/links.mts
const { languages } = await import("@/lib/content"); const { ESSENCIAL } = await import("@/content/essencial"); const { resolveLink } = await import("@/lib/essLinks");
const have = new Set<string>(); for (const l of languages) for (const c of l.categories) for (const e of c.entries) have.add(`${l.slug}/${c.slug}/${e.slug}`);
let bad = 0;
for (const l of languages) for (const c of l.categories) for (const e of c.entries) for (const r of (e as any).related ?? []) { const k = typeof r === "string" ? r : r.href ?? ""; if (k && !have.has(k.replace(/^\//, ""))) { bad++; console.log("relacionado quebrado:", `${l.slug}/${c.slug}/${e.slug}`, "→", k); } }
for (const t of ESSENCIAL) for (const s of t.steps) for (const k of s.links) if (!resolveLink(k)) { bad++; console.log("link do Essencial quebrado:", s.id, k); }
console.log("links verificados; quebrados:", bad);
