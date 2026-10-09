"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Wheel from "@/components/hub/Wheel";
import { langStyles } from "@/lib/langStyles";
import WebRunner from "@/components/hub/WebRunner";
import SqlRunner from "@/components/hub/SqlRunner";
import { CHALLENGES, CHALLENGE_BY_ID, LANG_META, LEVELS, LEVEL_XP, type Lang, type Level } from "@/content/challenges";
import { BADGES, addTry, dailyId, hubServerSnapshot, hubSnapshot, hubSubscribe, levelsLeft, markSolved, parseProg, pickChallenge, rankOf, resetHub, streakOf, xpOf } from "@/lib/hubStore";

const LEVEL_STYLE: Record<Level, string> = {
  "iniciante": "bg-ok-bg text-ok-fg",
  "intermediário": "bg-info-bg text-info-fg",
  "avançado": "bg-warn-bg text-warn-fg",
  "chefe": "bg-boss-bg text-boss-fg",
};
const noop = () => () => {};

export default function Hub() {
  const raw = useSyncExternalStore(hubSubscribe, hubSnapshot, hubServerSnapshot);
  const prog = useMemo(() => parseProg(raw), [raw]);
  const today = useSyncExternalStore(noop, () => new Date().toLocaleDateString("sv-SE"), () => "");
  const [selId, setSelId] = useState<string | null>(null);
  const [mode, setMode] = useState<"adaptativo" | Level>("adaptativo");
  const [tab, setTab] = useState<Lang | "todas">("todas");
  const [spun, setSpun] = useState<Lang | null>(null);
  const [gain, setGain] = useState<string>("");

  const xp = xpOf(prog);
  const rank = rankOf(xp);
  const streak = streakOf(prog.days, today);
  const solvedN = Object.keys(prog.solved).filter((id) => CHALLENGE_BY_ID.has(id)).length;
  const daily = dailyId(today);
  const sel = selId ? CHALLENGE_BY_ID.get(selId) ?? null : null;

  const open = useCallback((id: string) => {
    setSelId(id);
    setTimeout(() => document.getElementById("area-do-desafio")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, []);

  function onSpin(lang: Lang) {
    setSpun(lang);
    open(pickChallenge(lang, mode, prog, selId ?? undefined));
  }

  const solvedNow = useCallback(() => {
    if (!selId) return;
    const c = CHALLENGE_BY_ID.get(selId)!;
    const before = rankOf(xpOf(parseProg(hubSnapshot())));
    if (markSolved(selId)) {
      const after = rankOf(xpOf(parseProg(hubSnapshot())));
      setGain(`+${LEVEL_XP[c.level]} XP${after.name !== before.name ? ` · nova patente: ${after.emoji} ${after.name}!` : ""}`);
      setTimeout(() => setGain(""), 6000);
    }
  }, [selId]);

  const attempt = useCallback(() => { if (selId) addTry(selId); }, [selId]);

  const list = CHALLENGES.filter((c) => tab === "todas" || c.lang === tab);

  return (
    <div className="grid gap-8">
      {/* ---------- painel do jogador ---------- */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Sua patente</p>
              <p className="font-display text-2xl font-bold text-foreground">{rank.emoji} {rank.name}</p>
            </div>
            <div className="flex gap-5 text-center">
              <div><p className="font-display text-2xl font-bold text-foreground">{xp}</p><p className="text-xs text-muted">XP</p></div>
              <div><p className="font-display text-2xl font-bold text-foreground">🔥 {streak}</p><p className="text-xs text-muted">dias seguidos</p></div>
              <div><p className="font-display text-2xl font-bold text-foreground">{solvedN}/{CHALLENGES.length}</p><p className="text-xs text-muted">resolvidos</p></div>
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${rank.pct}%` }} /></div>
          <p className="mt-1.5 text-xs text-muted">{rank.next ? `${rank.next.min - xp} XP para ${rank.next.emoji} ${rank.next.name}` : "Patente máxima alcançada!"}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["html", "css", "js", "sql"] as Lang[]).map((l) => {
              const lv = levelsLeft(prog, l);
              const done = lv.reduce((n, x) => n + x.done, 0), total = lv.reduce((n, x) => n + x.total, 0);
              return (
                <div key={l} className="rounded-lg border border-border bg-background p-2.5">
                  <p className="text-xs font-semibold text-foreground">{LANG_META[l].emoji} {LANG_META[l].label} <span className="text-muted">{done}/{total}</span></p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full" style={{ width: `${(done / total) * 100}%`, background: LANG_META[l].color }} /></div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {BADGES.map((b) => {
              const on = b.test(prog, streak);
              return <span key={b.id} title={b.desc} className={`rounded-full border px-2.5 py-1 text-xs ${on ? "border-warn-fg/40 bg-warn-bg text-foreground" : "border-dashed border-border text-muted"}`}>{b.emoji} {b.name}{on ? "" : " 🔒"}</span>;
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-semibold text-foreground">🎲 Roleta de desafios</p>
          <p className="mt-1 text-sm text-muted">Gire e treine a linguagem sorteada. No modo adaptativo você sempre recebe o nível mais baixo que ainda não completou: do básico ao chefe.</p>
          <div className="mt-3">
            <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground" aria-label="Nível do sorteio">
              <option value="adaptativo">Modo adaptativo (recomendado)</option>
              {LEVELS.map((l) => <option key={l} value={l}>Só {l}</option>)}
            </select>
          </div>
          <div className="mt-4"><Wheel onResult={onSpin} /></div>
          {spun && <p className="mt-2 text-center text-sm text-muted">Sorteado: <b className="text-foreground">{LANG_META[spun].label}</b></p>}
        </div>
      </section>

      {/* ---------- desafio do dia ---------- */}
      {daily && CHALLENGE_BY_ID.get(daily) && (() => {
        const c = CHALLENGE_BY_ID.get(daily)!;
        return (
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-warn-fg/40 bg-warn-bg/40 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-warn-fg">📅 Desafio do dia</p>
              <p className="mt-0.5 font-semibold text-foreground">{c.title} <span className="font-normal text-muted">· {LANG_META[c.lang].label} · {c.level}</span></p>
            </div>
            <button onClick={() => open(c.id)} className="rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background hover:opacity-90">{prog.solved[c.id] ? "✅ Refazer" : "Aceitar o desafio"}</button>
          </section>
        );
      })()}

      {/* ---------- área de trabalho ---------- */}
      <section id="area-do-desafio" className="scroll-mt-20">
        {sel ? (
          <div className="rounded-2xl border border-border bg-background">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
              <div className="min-w-0 max-w-3xl">
                <p className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-bold ${langStyles[sel.lang as keyof typeof langStyles].bgSoft} ${langStyles[sel.lang as keyof typeof langStyles].text}`}><span className="h-2 w-2 rounded-full" style={{ background: LANG_META[sel.lang].color }} />{LANG_META[sel.lang].label}</span>
                  <span className={`rounded-full px-2 py-0.5 font-semibold ${LEVEL_STYLE[sel.level]}`}>{sel.level} · {LEVEL_XP[sel.level]} XP</span>
                  {prog.solved[sel.id] && <span className="text-ok-fg">✅ já resolvido</span>}
                  {prog.tries[sel.id] ? <span className="text-muted">{prog.tries[sel.id]} tentativa(s)</span> : null}
                </p>
                <h2 className="mt-1.5 font-display text-xl font-bold text-foreground">{sel.title}</h2>
                <p className="mt-1 leading-relaxed text-foreground/90">{sel.brief}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => open(pickChallenge(sel.lang, mode, prog, sel.id))} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-muted">Outro de {LANG_META[sel.lang].label} →</button>
                <button onClick={() => setSelId(null)} className="rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground">fechar ✕</button>
              </div>
            </div>
            <div className="p-4">
              {gain && <p role="status" className="mb-3 rounded-lg bg-ok-bg p-3 text-center text-sm font-bold text-ok-fg">🎉 Desafio concluído! {gain}</p>}
              {sel.kind === "web"
                ? <WebRunner key={sel.id} challenge={sel} onAttempt={attempt} onSolved={solvedNow} />
                : <SqlRunner key={sel.id} challenge={sel} onAttempt={attempt} onSolved={solvedNow} />}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
            <p className="text-lg text-foreground">Escolha um desafio para começar</p>
            <p className="mt-1 text-sm">Gire a roleta, aceite o desafio do dia ou escolha um da lista abaixo.</p>
          </div>
        )}
      </section>

      {/* ---------- lista ---------- */}
      <section>
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Linguagem">
          {(["todas", "html", "css", "js", "sql"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${tab === t ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:text-foreground"}`}>
              {t === "todas" ? `Todos (${CHALLENGES.length})` : `${LANG_META[t].emoji} ${LANG_META[t].label} (${CHALLENGES.filter((c) => c.lang === t).length})`}
            </button>
          ))}
        </div>
        {LEVELS.map((lv) => {
          const items = list.filter((c) => c.level === lv);
          if (!items.length) return null;
          return (
            <div key={lv} className="mt-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                <span className={`rounded-full px-2 py-0.5 text-xs ${LEVEL_STYLE[lv]}`}>{lv}</span> {LEVEL_XP[lv]} XP cada · {items.filter((c) => prog.solved[c.id]).length}/{items.length}
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((c) => (
                  <button key={c.id} onClick={() => open(c.id)} className={`flex items-start gap-3 rounded-xl border bg-surface p-3 text-left transition-colors hover:border-muted ${selId === c.id ? "border-foreground" : "border-border"}`}>
                    <span className="mt-0.5 text-lg">{prog.solved[c.id] ? "✅" : LANG_META[c.lang].emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-foreground">{c.title}</span>
                      <span className="mt-0.5 block text-xs text-muted">{LANG_META[c.lang].label}{prog.tries[c.id] ? ` · ${prog.tries[c.id]} tentativa(s)` : ""}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div className="mt-8 text-right">
          <button onClick={() => { if (confirm("Apagar todo o seu progresso (XP, desafios resolvidos e sequência)?")) resetHub(); }} className="text-xs text-muted underline underline-offset-4 hover:text-foreground">Reiniciar progresso</button>
        </div>
      </section>
    </div>
  );
}
