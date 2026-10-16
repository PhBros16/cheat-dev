import { CHALLENGES, CHALLENGE_BY_ID, LANG_META, LEVELS, type Challenge, type Lang, type Level } from "@/content/challenges";
import { TRACK_BY_ID, TRACK_OF } from "@/content/tracks";

/** Configuração da roleta: quais linguagens e níveis entram, se só os pendentes, e uma seleção manual (desafio a desafio). */
export type WheelCfg = { langs: Lang[]; levels: Level[]; onlyPending: boolean; custom: string[] };
export const ALL_LANGS: Lang[] = ["html", "css", "js", "sql"];
export const DEFAULT_WHEEL: WheelCfg = { langs: [...ALL_LANGS], levels: [...LEVELS], onlyPending: true, custom: [] };
/** Até este número de desafios, cada fatia da roleta é UM desafio; acima, as fatias são grupos (linguagens, trilhas ou níveis). */
export const MAX_SLICES = 12;

export type Slice = { key: string; label: string; color: string };
type Solved = Record<string, unknown>;

/** Valida o que veio do localStorage: ids desconhecidos somem e listas vazias voltam ao padrão. */
export function sanitizeCfg(x: unknown): WheelCfg {
  const o = (x && typeof x === "object" ? x : {}) as Partial<Record<keyof WheelCfg, unknown>>;
  const langs = Array.isArray(o.langs) ? ALL_LANGS.filter((l) => (o.langs as unknown[]).includes(l)) : [];
  const levels = Array.isArray(o.levels) ? LEVELS.filter((l) => (o.levels as unknown[]).includes(l)) : [];
  const custom = Array.isArray(o.custom) ? (o.custom as unknown[]).filter((id): id is string => typeof id === "string" && CHALLENGE_BY_ID.has(id)) : [];
  return { langs: langs.length ? langs : [...ALL_LANGS], levels: levels.length ? levels : [...LEVELS], onlyPending: typeof o.onlyPending === "boolean" ? o.onlyPending : true, custom };
}

/** O conjunto de desafios que a roleta sorteia. `relaxed` = tudo que o filtro pegou já foi resolvido, então os resolvidos voltaram ao jogo. */
export function wheelPool(cfg: WheelCfg, solved: Solved): { pool: Challenge[]; relaxed: boolean; manual: boolean } {
  if (cfg.custom.length) { const set = new Set(cfg.custom); return { pool: CHALLENGES.filter((c) => set.has(c.id)), relaxed: false, manual: true }; }
  const base = CHALLENGES.filter((c) => cfg.langs.includes(c.lang) && cfg.levels.includes(c.level));
  if (!cfg.onlyPending) return { pool: base, relaxed: false, manual: false };
  const pending = base.filter((c) => !solved[c.id]);
  return pending.length ? { pool: pending, relaxed: false, manual: false } : { pool: base, relaxed: base.length > 0, manual: false };
}

const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const LEVEL_COLOR: Record<Level, string> = { "iniciante": "#16a34a", "intermediário": "#d97706", "avançado": "#dc2626", "chefe": "#7c3aed" };

/** As fatias da roleta. Sem fatias (< 2 opções) = não há o que girar. */
export function wheelSlices(pool: Challenge[]): Slice[] {
  if (pool.length < 2) return [];
  if (pool.length <= MAX_SLICES) {
    const n = pool.length <= 6 ? 16 : 11;
    return pool.map((c) => ({ key: "c:" + c.id, label: short(c.title, n), color: LANG_META[c.lang].color }));
  }
  const langs = ALL_LANGS.filter((l) => pool.some((c) => c.lang === l));
  if (langs.length >= 2) return langs.map((l) => ({ key: "l:" + l, label: l === "js" ? "JS" : LANG_META[l].label, color: LANG_META[l].color }));
  const tracks = [...new Set(pool.map((c) => TRACK_OF.get(c.id)).filter((t): t is string => !!t))];
  if (tracks.length >= 2 && tracks.length <= MAX_SLICES) return tracks.map((t) => ({ key: "t:" + t, label: short(TRACK_BY_ID.get(t)!.title, 11), color: LANG_META[TRACK_BY_ID.get(t)!.lang].color }));
  const lvs = LEVELS.filter((l) => pool.some((c) => c.level === l));
  return lvs.length >= 2 ? lvs.map((l) => ({ key: "v:" + l, label: l, color: LEVEL_COLOR[l] })) : [];
}

/** Resolve a fatia sorteada para um desafio: dentro do grupo, prefere um pendente do nível mais baixo (modo adaptativo). */
export function resolveSpin(key: string, pool: Challenge[], solved: Solved, avoid?: string, rand: () => number = Math.random): string | null {
  const [kind, v] = [key.slice(0, 1), key.slice(2)];
  let subset = pool.filter((c) => (kind === "c" ? c.id === v : kind === "l" ? c.lang === v : kind === "t" ? TRACK_OF.get(c.id) === v : c.level === v));
  if (!subset.length) subset = pool;
  if (!subset.length) return null;
  const notAvoided = subset.filter((c) => c.id !== avoid); if (notAvoided.length) subset = notAvoided;
  let cands: Challenge[] = [];
  for (const lv of LEVELS) { cands = subset.filter((c) => c.level === lv && !solved[c.id]); if (cands.length) break; }
  if (!cands.length) cands = subset;
  return cands[Math.floor(rand() * cands.length)].id;
}

/** Rótulo legível da fatia (para o "Sorteado: …"). */
export function sliceLabel(key: string): string {
  const [kind, v] = [key.slice(0, 1), key.slice(2)];
  if (kind === "c") return CHALLENGE_BY_ID.get(v)?.title ?? v;
  if (kind === "l") return LANG_META[v as Lang]?.label ?? v;
  if (kind === "t") return TRACK_BY_ID.get(v)?.title ?? v;
  return v;
}
