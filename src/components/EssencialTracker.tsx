"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

type Link_ = { label: string; href: string; kind: string };
type Step = { id: string; title: string; why: string; skip: string; task: string; links: Link_[] };
type Track = { id: string; title: string; emoji: string; intro: string; steps: Step[] };

const KEY = "cheatdev:essencial:v1";
const subs = new Set<() => void>();
const snap = () => { try { return localStorage.getItem(KEY) ?? "[]"; } catch { return "[]"; } };
const subscribe = (cb: () => void) => { subs.add(cb); window.addEventListener("storage", cb); return () => { subs.delete(cb); window.removeEventListener("storage", cb); }; };
function toggle(id: string) {
  let list: string[] = [];
  try { list = JSON.parse(snap()); } catch {}
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  subs.forEach((f) => f());
}

const KIND_DOT: Record<string, string> = { HTML: "bg-html", CSS: "bg-css", JavaScript: "bg-js", SQL: "bg-sql" };

export default function EssencialTracker({ tracks }: { tracks: Track[] }) {
  const raw = useSyncExternalStore(subscribe, snap, () => "[]");
  const done: string[] = (() => { try { return JSON.parse(raw); } catch { return []; } })();
  const [tab, setTab] = useState(tracks[0].id);

  const total = tracks.reduce((n, t) => n + t.steps.length, 0);
  const doneTotal = tracks.reduce((n, t) => n + t.steps.filter((s) => done.includes(s.id)).length, 0);
  const track = tracks.find((t) => t.id === tab) ?? tracks[0];
  const firstOpen = track.steps.find((s) => !done.includes(s.id))?.id;

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground">Seu progresso geral</span>
          <span className="font-mono text-muted">{doneTotal}/{total} passos · {Math.round((doneTotal / total) * 100)}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(doneTotal / total) * 100}%` }} /></div>
        <p className="mt-2 text-xs text-muted">Marque cada passo quando fizer a tarefa. O progresso fica salvo neste navegador.</p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Trilhas">
        {tracks.map((t) => {
          const d = t.steps.filter((s) => done.includes(s.id)).length;
          return (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${tab === t.id ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:text-foreground"}`}>
              {t.emoji} {t.title} <span className="font-mono text-[0.85em]">{d}/{t.steps.length}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 max-w-3xl text-muted">{track.intro}</p>

      <ol className="mt-5 grid gap-3">
        {track.steps.map((s, i) => {
          const ok = done.includes(s.id);
          return (
            <li key={s.id}>
              <details open={s.id === firstOpen} className={`group rounded-xl border bg-surface ${ok ? "border-ok-fg/40" : "border-border"}`}>
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
                  <button
                    type="button" role="checkbox" aria-checked={ok} aria-label={`Marcar "${s.title}" como feito`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(s.id); }}
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 text-xs font-bold ${ok ? "border-accent bg-accent text-on-accent" : "border-border text-transparent hover:border-muted"}`}
                  >✓</button>
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`flex-1 font-semibold ${ok ? "text-muted line-through" : "text-foreground"}`}>{s.title}</span>
                  <span className="text-muted transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="grid gap-3 border-t border-border px-4 py-4 text-sm">
                  <p className="text-foreground"><b>Por que importa:</b> {s.why}</p>
                  <p className="rounded-lg bg-warn-bg p-2.5 text-foreground"><b>⚠ Se você pular:</b> {s.skip}</p>
                  <p className="rounded-lg bg-ok-bg p-2.5 text-foreground"><b>✅ Faça agora:</b> {s.task}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.links.map((l) => (
                      <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-foreground hover:border-muted">
                        <span className={`h-1.5 w-1.5 rounded-full ${KIND_DOT[l.kind] ?? "bg-muted"}`} />{l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
