import { CHALLENGE_BY_ID, type Lang } from "@/content/challenges";
import { TRACKS, TRACK_BY_ID, TRACK_OF, type Track } from "@/content/tracks";

type Solved = Record<string, unknown>;

export const tracksOf = (lang: Lang | "todas"): Track[] => TRACKS.filter((t) => lang === "todas" || t.lang === lang);

export function trackProgress(t: Track, solved: Solved) {
  const done = t.ids.filter((id) => solved[id]).length;
  return { done, total: t.ids.length, next: t.ids.find((id) => !solved[id]) ?? null, complete: done === t.ids.length };
}

/** Próximo desafio pendente de uma linguagem, seguindo a ordem das trilhas. */
export function nextInLang(lang: Lang, solved: Solved): string | null {
  for (const t of tracksOf(lang)) { const n = t.ids.find((id) => !solved[id]); if (n) return n; }
  return null;
}

/** Próximo passo depois de `id`: o próximo pendente da mesma trilha (depois dele, ou o primeiro pendente); senão o próximo da linguagem. */
export function nextAfter(id: string, solved: Solved): string | null {
  const tid = TRACK_OF.get(id); const t = tid ? TRACK_BY_ID.get(tid) : undefined;
  if (t) {
    const i = t.ids.indexOf(id);
    const after = t.ids.slice(i + 1).find((x) => !solved[x]) ?? t.ids.find((x) => x !== id && !solved[x]);
    if (after) return after;
  }
  const lang = CHALLENGE_BY_ID.get(id)?.lang;
  const n = lang ? nextInLang(lang, solved) : null;
  return n && n !== id ? n : null;
}

/** Posição do desafio na trilha: "passo 3 de 6". */
export function stepOf(id: string) {
  const tid = TRACK_OF.get(id); const t = tid ? TRACK_BY_ID.get(tid) : undefined;
  return t ? { track: t, step: t.ids.indexOf(id) + 1, total: t.ids.length } : null;
}
