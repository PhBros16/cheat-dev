import { CHALLENGES, CHALLENGE_BY_ID, LEVEL_XP, LEVELS, type Lang, type Level } from "@/content/challenges";

export type Prog = { solved: Record<string, string>; tries: Record<string, number>; days: string[] };

const KEY = "cheatdev:hub:v1";
const subs = new Set<() => void>();
const EMPTY = JSON.stringify({ solved: {}, tries: {}, days: [] });

export const hubSnapshot = () => { try { return localStorage.getItem(KEY) ?? EMPTY; } catch { return EMPTY; } };
export const hubServerSnapshot = () => EMPTY;
export const hubSubscribe = (cb: () => void) => { subs.add(cb); window.addEventListener("storage", cb); return () => { subs.delete(cb); window.removeEventListener("storage", cb); }; };
export const parseProg = (raw: string): Prog => { try { return { solved: {}, tries: {}, days: [], ...JSON.parse(raw) }; } catch { return { solved: {}, tries: {}, days: [] }; } };

const save = (p: Prog) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {} subs.forEach((f) => f()); };
const today = () => new Date().toLocaleDateString("sv-SE");

export function markSolved(id: string) {
  const p = parseProg(hubSnapshot());
  if (p.solved[id]) return false;
  p.solved[id] = new Date().toISOString();
  if (!p.days.includes(today())) p.days.push(today());
  save(p);
  return true;
}
export function addTry(id: string) { const p = parseProg(hubSnapshot()); p.tries[id] = (p.tries[id] ?? 0) + 1; save(p); }
export function resetHub() { save({ solved: {}, tries: {}, days: [] }); }

/* ---------- pontos, patentes, sequência e conquistas ---------- */
export const xpOf = (p: Prog) => Object.keys(p.solved).reduce((n, id) => n + (CHALLENGE_BY_ID.get(id) ? LEVEL_XP[CHALLENGE_BY_ID.get(id)!.level] : 0), 0);

export const RANKS = [
  { min: 0, name: "Aprendiz", emoji: "🌱" },
  { min: 100, name: "Construtor", emoji: "🔨" },
  { min: 300, name: "Desenvolvedor", emoji: "⚙️" },
  { min: 700, name: "Pleno", emoji: "🚀" },
  { min: 1400, name: "Sênior", emoji: "👑" },
  { min: 2400, name: "Mestre", emoji: "🏆" },
];

export function rankOf(xp: number) {
  let i = 0;
  RANKS.forEach((r, k) => { if (xp >= r.min) i = k; });
  const next = RANKS[i + 1];
  return { ...RANKS[i], next, pct: next ? ((xp - RANKS[i].min) / (next.min - RANKS[i].min)) * 100 : 100 };
}

const dayMs = 86400000;
export function streakOf(days: string[], todayStr: string) {
  if (!todayStr) return 0;
  const set = new Set(days);
  let d = new Date(todayStr + "T12:00:00");
  if (!set.has(todayStr)) d = new Date(d.getTime() - dayMs); // ontem ainda conta se hoje ainda não resolveu
  let n = 0;
  while (set.has(d.toLocaleDateString("sv-SE"))) { n++; d = new Date(d.getTime() - dayMs); }
  return n;
}

export const BADGES: { id: string; emoji: string; name: string; desc: string; test: (p: Prog, streak: number) => boolean }[] = [
  { id: "first", emoji: "🎯", name: "Primeiro passo", desc: "Resolva 1 desafio", test: (p) => Object.keys(p.solved).length >= 1 },
  { id: "five", emoji: "🔥", name: "Aquecendo", desc: "Resolva 5 desafios", test: (p) => Object.keys(p.solved).length >= 5 },
  { id: "twenty", emoji: "🏃", name: "Maratonista", desc: "Resolva 20 desafios", test: (p) => Object.keys(p.solved).length >= 20 },
  { id: "poly", emoji: "🌐", name: "Poliglota", desc: "Resolva ao menos 1 de cada linguagem", test: (p) => (["html", "css", "js", "sql"] as Lang[]).every((l) => CHALLENGES.some((c) => c.lang === l && p.solved[c.id])) },
  { id: "base", emoji: "🧱", name: "Base sólida", desc: "Conclua todos os iniciantes", test: (p) => CHALLENGES.filter((c) => c.level === "iniciante").every((c) => p.solved[c.id]) },
  { id: "boss", emoji: "🐉", name: "Matador de chefes", desc: "Derrote 1 desafio chefe", test: (p) => CHALLENGES.some((c) => c.level === "chefe" && p.solved[c.id]) },
  { id: "s3", emoji: "📅", name: "Em chamas", desc: "3 dias seguidos", test: (_p, s) => s >= 3 },
  { id: "s7", emoji: "🗓️", name: "Semana perfeita", desc: "7 dias seguidos", test: (_p, s) => s >= 7 },
];

/** Desafio do dia: o mesmo para todos, muda à meia-noite. */
export function dailyId(dateStr: string): string | null {
  if (!dateStr) return null;
  let h = 0;
  for (const ch of dateStr) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CHALLENGES[h % CHALLENGES.length].id;
}

export function levelsLeft(p: Prog, lang: Lang) {
  return LEVELS.map((lv) => ({ lv, total: CHALLENGES.filter((c) => c.lang === lang && c.level === lv).length, done: CHALLENGES.filter((c) => c.lang === lang && c.level === lv && p.solved[c.id]).length }));
}

/** Escolhe um desafio de uma linguagem: modo adaptativo (o nível mais baixo ainda incompleto) ou um nível fixo. */
export function pickChallenge(lang: Lang | "qualquer", mode: "adaptativo" | Level, p: Prog, avoid?: string): string {
  const pool = CHALLENGES.filter((c) => (lang === "qualquer" || c.lang === lang) && c.id !== avoid);
  let cands: typeof pool = [];
  if (mode === "adaptativo") {
    for (const lv of LEVELS) { cands = pool.filter((c) => c.level === lv && !p.solved[c.id]); if (cands.length) break; }
  } else cands = pool.filter((c) => c.level === mode && !p.solved[c.id]);
  if (!cands.length) cands = pool.filter((c) => mode === "adaptativo" || c.level === mode);
  if (!cands.length) cands = pool;
  return cands[Math.floor(Math.random() * cands.length)].id;
}
