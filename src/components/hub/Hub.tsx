"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Wheel from "@/components/hub/Wheel";
import Learn from "@/components/hub/Learn";
import { langStyles } from "@/lib/langStyles";
import WebRunner from "@/components/hub/WebRunner";
import SqlRunner from "@/components/hub/SqlRunner";
import { CHALLENGES, CHALLENGE_BY_ID, LANG_META, LEVELS, LEVEL_XP, type Lang, type Level } from "@/content/challenges";
import { BADGES, addTry, dailyId, hubServerSnapshot, hubSnapshot, hubSubscribe, levelsLeft, markSolved, parseProg, pickChallenge, rankOf, resetHub, streakOf, xpOf } from "@/lib/hubStore";
import { ALL_LANGS, resolveSpin, sliceLabel, wheelPool, wheelSlices, type WheelCfg } from "@/lib/wheelPool";
import { parseWheel, saveWheel, wheelServerSnapshot, wheelSnapshot, wheelSubscribe } from "@/lib/wheelStore";
import { nextAfter, nextInLang, stepOf, trackProgress, tracksOf } from "@/lib/trilhas";

const LEVEL_STYLE: Record<Level, string> = {
  "iniciante": "bg-ok-bg text-ok-fg",
  "intermediário": "bg-info-bg text-info-fg",
  "avançado": "bg-warn-bg text-warn-fg",
  "chefe": "bg-boss-bg text-boss-fg",
};
const chip = (on: boolean, dim = false) =>
  `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${dim
    ? `cursor-not-allowed border-dashed border-border ${on ? "bg-surface-muted text-foreground" : "text-muted"}`
    : on ? "border-accent bg-accent text-on-accent" : "border-border text-muted hover:text-foreground"}`;
const noop = () => () => {};

export default function Hub() {
  const raw = useSyncExternalStore(hubSubscribe, hubSnapshot, hubServerSnapshot);
  const prog = useMemo(() => parseProg(raw), [raw]);
  const rawWheel = useSyncExternalStore(wheelSubscribe, wheelSnapshot, wheelServerSnapshot);
  const cfg = useMemo(() => parseWheel(rawWheel), [rawWheel]);
  const today = useSyncExternalStore(noop, () => new Date().toLocaleDateString("sv-SE"), () => "");
  const [selId, setSelId] = useState<string | null>(null);
  const [tab, setTab] = useState<Lang | "todas">("todas");
  const [view, setView] = useState<"trilhas" | "nivel">("trilhas");
  const [picking, setPicking] = useState(false);
  const [spunKey, setSpunKey] = useState<string | null>(null);
  const [gain, setGain] = useState<string>("");

  const { pool, relaxed, manual } = useMemo(() => wheelPool(cfg, prog.solved), [cfg, prog.solved]);
  const slices = useMemo(() => wheelSlices(pool), [pool]);
  const setCfg = (p: Partial<WheelCfg>) => saveWheel({ ...cfg, ...p });
  const toggleLang = (l: Lang) => { const next = ALL_LANGS.filter((x) => (x === l ? !cfg.langs.includes(l) : cfg.langs.includes(x))); if (next.length) setCfg({ langs: next }); };
  const toggleLevel = (lv: Level) => { const next = LEVELS.filter((x) => (x === lv ? !cfg.levels.includes(lv) : cfg.levels.includes(x))); if (next.length) setCfg({ levels: next }); };
  const toggleCustom = (id: string) => setCfg({ custom: cfg.custom.includes(id) ? cfg.custom.filter((x) => x !== id) : [...cfg.custom, id] });

  const xp = xpOf(prog);
  const rank = rankOf(xp);
  const streak = streakOf(prog.days, today);
  const solvedN = Object.keys(prog.solved).filter((id) => CHALLENGE_BY_ID.has(id)).length;
  const daily = dailyId(today);
  const sel = selId ? CHALLENGE_BY_ID.get(selId) ?? null : null;
  const step = sel ? stepOf(sel.id) : null;
  const nextId = sel ? nextAfter(sel.id, prog.solved) : null;

  const open = useCallback((id: string) => {
    setSelId(id);
    setTimeout(() => document.getElementById("area-do-desafio")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, []);

  function onSpin(key: string) {
    setSpunKey(key);
    const id = resolveSpin(key, pool, prog.solved, selId ?? undefined);
    if (id) open(id);
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
  const langsShown = tab === "todas" ? ALL_LANGS : [tab];

  /** Cartão de um desafio na lista (com caixa de seleção quando se está montando a roleta). */
  const card = (c: (typeof CHALLENGES)[number], n?: number, isNext?: boolean) => (
    <div key={c.id} className="relative">
      <button onClick={() => open(c.id)} className={`flex w-full items-start gap-3 rounded-xl border bg-surface p-3 text-left transition-colors hover:border-muted ${picking ? "pr-10" : ""} ${selId === c.id ? "border-foreground" : isNext ? "border-accent ring-1 ring-accent" : "border-border"}`}>
        <span className="mt-0.5 w-6 shrink-0 text-center text-lg">{prog.solved[c.id] ? "✅" : n !== undefined ? <span className="font-mono text-sm font-bold text-muted">{n}</span> : LANG_META[c.lang].emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-foreground">{c.title}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
            <span className={`rounded-full px-1.5 py-px text-[11px] font-semibold ${LEVEL_STYLE[c.level]}`}>{c.level}</span>
            {n === undefined && <span>{LANG_META[c.lang].label}</span>}
            {isNext && !prog.solved[c.id] && <span className="font-semibold text-accent-fg">próximo</span>}
            {prog.tries[c.id] ? <span>{prog.tries[c.id]} tentativa(s)</span> : null}
          </span>
        </span>
      </button>
      {picking && <input type="checkbox" checked={cfg.custom.includes(c.id)} onChange={() => toggleCustom(c.id)} aria-label={`Incluir "${c.title}" na roleta`} className="absolute right-3 top-3.5 h-4 w-4 cursor-pointer accent-[var(--accent)]" />}
    </div>
  );

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
            {ALL_LANGS.map((l) => {
              const lv = levelsLeft(prog, l);
              const done = lv.reduce((n, x) => n + x.done, 0), total = lv.reduce((n, x) => n + x.total, 0);
              const next = nextInLang(l, prog.solved);
              return (
                <div key={l} className="rounded-lg border border-border bg-background p-2.5">
                  <p className="text-xs font-semibold text-foreground">{LANG_META[l].emoji} {LANG_META[l].label} <span className="text-muted">{done}/{total}</span></p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full" style={{ width: `${(done / total) * 100}%`, background: LANG_META[l].color }} /></div>
                  {next ? <button onClick={() => open(next)} className="mt-2 text-xs font-semibold text-accent-fg hover:underline" aria-label={`Continuar ${LANG_META[l].label}: ${CHALLENGE_BY_ID.get(next)?.title}`}>▶ Continuar</button> : <p className="mt-2 text-xs font-semibold text-ok-fg">✅ Completo</p>}
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

        {/* ---------- roleta configurável ---------- */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-semibold text-foreground">🎲 Roleta de desafios</p>
          <p className="mt-1 text-sm text-muted">Monte a sua roleta: escolha linguagens e níveis, ou marque desafios um a um. Com poucas opções, cada fatia é um desafio.</p>
          <fieldset className="mt-3" disabled={manual}>
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted">Linguagens</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {ALL_LANGS.map((l) => <button key={l} type="button" aria-pressed={cfg.langs.includes(l)} onClick={() => toggleLang(l)} className={chip(cfg.langs.includes(l), manual)}>{LANG_META[l].emoji} {LANG_META[l].label}</button>)}
            </div>
            <legend className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Níveis</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {LEVELS.map((lv) => <button key={lv} type="button" aria-pressed={cfg.levels.includes(lv)} onClick={() => toggleLevel(lv)} className={chip(cfg.levels.includes(lv), manual)}>{lv}</button>)}
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={cfg.onlyPending} onChange={(e) => setCfg({ onlyPending: e.target.checked })} className="h-4 w-4 accent-[var(--accent)]" /> Só os que ainda não resolvi
            </label>
          </fieldset>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
            <p role="status" className="text-foreground"><b>{pool.length}</b> {pool.length === 1 ? "desafio" : "desafios"} na roleta{manual ? " (sua seleção)" : ""}</p>
            <div className="flex gap-2">
              <button type="button" aria-pressed={picking} onClick={() => { setPicking((v) => !v); document.getElementById("lista-de-desafios")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={chip(picking)}>☑️ Escolher um a um</button>
              {manual && <button type="button" onClick={() => setCfg({ custom: [] })} className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-foreground">Limpar seleção ({cfg.custom.length})</button>}
            </div>
          </div>
          {relaxed && <p className="mt-2 rounded-lg bg-info-bg p-2 text-xs text-info-fg">Você já resolveu tudo dessa seleção: os resolvidos voltaram para a roleta.</p>}
          <div className="mt-4">
            {slices.length >= 2
              ? <Wheel slices={slices} onResult={onSpin} ariaLabel={`Roleta com ${slices.length} opções: ${slices.map((x) => x.label).join(", ")}`} />
              : pool.length === 1
                ? <button onClick={() => open(pool[0].id)} className="w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background hover:opacity-90">Abrir “{pool[0].title}”</button>
                : <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted">Nenhum desafio nessa combinação. Ajuste as linguagens e os níveis.</p>}
          </div>
          {spunKey && <p className="mt-2 text-center text-sm text-muted">Sorteado: <b className="text-foreground">{sliceLabel(spunKey)}</b></p>}
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
                {step && <p className="mt-1 text-xs text-muted">Trilha <b className="text-foreground">{step.track.title}</b> · passo {step.step} de {step.total}</p>}
                <p className="mt-1 leading-relaxed text-foreground/90">{sel.brief}</p>
              </div>
              <div className="flex gap-2">
                {nextId && <button onClick={() => open(nextId)} className="rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-90">Próximo passo →</button>}
                <button onClick={() => open(pickChallenge(sel.lang, "adaptativo", prog, sel.id))} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-muted">Outro de {LANG_META[sel.lang].label} →</button>
                <button onClick={() => setSelId(null)} className="rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground">fechar ✕</button>
              </div>
            </div>
            <div className="p-4">
              {sel.learn && <Learn key={sel.id} text={sel.learn} />}
              {gain && <p role="status" className="mb-3 rounded-lg bg-ok-bg p-3 text-center text-sm font-bold text-ok-fg">🎉 Desafio concluído! {gain}</p>}
              {sel.kind === "web"
                ? <WebRunner key={sel.id} challenge={sel} onAttempt={attempt} onSolved={solvedNow} />
                : <SqlRunner key={sel.id} challenge={sel} onAttempt={attempt} onSolved={solvedNow} />}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
            <p className="text-lg text-foreground">Escolha um desafio para começar</p>
            <p className="mt-1 text-sm">Gire a roleta, aceite o desafio do dia ou siga uma trilha da lista abaixo, do básico ao avançado.</p>
          </div>
        )}
      </section>

      {/* ---------- lista: trilhas ou níveis ---------- */}
      <section id="lista-de-desafios" className="scroll-mt-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Linguagem">
            {(["todas", "html", "css", "js", "sql"] as const).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${tab === t ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:text-foreground"}`}>
                {t === "todas" ? `Todos (${CHALLENGES.length})` : `${LANG_META[t].emoji} ${LANG_META[t].label} (${CHALLENGES.filter((c) => c.lang === t).length})`}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Organização da lista" className="flex gap-1.5">
            <button type="button" aria-pressed={view === "trilhas"} onClick={() => setView("trilhas")} className={chip(view === "trilhas")}>🛤️ Trilhas</button>
            <button type="button" aria-pressed={view === "nivel"} onClick={() => setView("nivel")} className={chip(view === "nivel")}>📊 Por nível</button>
          </div>
        </div>

        {picking && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-accent/40 bg-accent-soft p-3 text-sm text-foreground">
            <p>☑️ Marque os desafios que entram na roleta. <b>{cfg.custom.length}</b> selecionado(s).</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCfg({ custom: [...new Set([...cfg.custom, ...list.map((c) => c.id)])] })} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:border-muted">Selecionar os {list.length} visíveis</button>
              <button type="button" onClick={() => setCfg({ custom: [] })} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:border-muted">Limpar</button>
              <button type="button" onClick={() => setPicking(false)} className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background hover:opacity-90">Pronto</button>
            </div>
          </div>
        )}

        {view === "trilhas" ? (
          langsShown.map((l) => {
            const trs = tracksOf(l);
            const total = trs.reduce((n, t) => n + t.ids.length, 0), done = trs.reduce((n, t) => n + trackProgress(t, prog.solved).done, 0);
            return (
              <div key={l} className="mt-8">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground"><span className="h-3 w-3 rounded-full" style={{ background: LANG_META[l].color }} /> {LANG_META[l].label} <span className="text-sm font-normal text-muted">{done}/{total} · {trs.length} trilhas</span></h3>
                {trs.map((t) => {
                  const tp = trackProgress(t, prog.solved);
                  return (
                    <div key={t.id} className="mt-5">
                      <div className="flex flex-wrap items-end justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-foreground">{t.title}</h4>
                          <p className="text-xs text-muted">{t.desc}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted">{tp.done}/{tp.total}</span>
                          {tp.next ? <button onClick={() => open(tp.next!)} aria-label={`Continuar a trilha ${t.title}`} className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-accent-fg hover:border-muted">▶ Continuar</button> : <span className="text-xs font-semibold text-ok-fg">✅ Trilha concluída</span>}
                        </div>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full" style={{ width: `${(tp.done / tp.total) * 100}%`, background: LANG_META[l].color }} /></div>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {t.ids.map((id, i) => card(CHALLENGE_BY_ID.get(id)!, i + 1, id === tp.next))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          LEVELS.map((lv) => {
            const items = list.filter((c) => c.level === lv);
            if (!items.length) return null;
            return (
              <div key={lv} className="mt-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${LEVEL_STYLE[lv]}`}>{lv}</span> {LEVEL_XP[lv]} XP cada · {items.filter((c) => prog.solved[c.id]).length}/{items.length}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map((c) => card(c))}</div>
              </div>
            );
          })
        )}
        <div className="mt-8 text-right">
          <button onClick={() => { if (confirm("Apagar todo o seu progresso (XP, desafios resolvidos e sequência)?")) resetHub(); }} className="text-xs text-muted underline underline-offset-4 hover:text-foreground">Reiniciar progresso</button>
        </div>
      </section>
    </div>
  );
}
