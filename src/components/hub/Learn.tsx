import type { ReactNode } from "react";
import { parseBlocks, parseInline, type Tok } from "@/lib/learnParse";

function render(toks: Tok[], key: string): ReactNode[] {
  return toks.map((t, i) => {
    if (t.k === "code") return <code key={key + i} className="rounded bg-surface-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground">{t.s}</code>;
    if (t.k === "b") return <strong key={key + i} className="font-semibold text-foreground">{render(t.c ?? [], key + i + "-")}</strong>;
    return t.s;
  });
}

export function LearnBody({ text }: { text: string }) {
  return (
    <div className="grid gap-3 text-sm leading-relaxed text-foreground/90">
      {parseBlocks(text).map((b, i) =>
        b.k === "pre"
          ? <pre key={i} className="overflow-x-auto rounded-lg bg-code p-3 font-mono text-[13px] leading-relaxed text-foreground"><code>{b.s}</code></pre>
          : <p key={i}>{render(parseInline(b.s), `${i}-`)}</p>,
      )}
    </div>
  );
}

/** Caixa "📘 Aprenda": a mini-aula que vem antes do exercício. */
export default function Learn({ text }: { text: string }) {
  return (
    <details open className="mb-4 rounded-xl border border-info-fg/30 bg-info-bg/40 p-4">
      <summary className="cursor-pointer text-sm font-bold text-info-fg">📘 Aprenda antes de praticar</summary>
      <div className="mt-3"><LearnBody text={text} /></div>
    </details>
  );
}
