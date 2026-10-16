import type { ReactNode } from "react";

/** Renderiza o texto de uma mini-aula: parágrafos separados por linha em branco, `código` em linha, **negrito** e blocos ```cercados```. */
function inline(text: string, keyBase: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("`")) return <code key={keyBase + i} className="rounded bg-surface-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground">{part.slice(1, -1)}</code>;
    if (part.startsWith("**")) return <strong key={keyBase + i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    return part;
  });
}

export function LearnBody({ text }: { text: string }) {
  const blocks = text.split(/```(?:\w+)?\n([\s\S]*?)```/g); // ímpares = código
  return (
    <div className="grid gap-3 text-sm leading-relaxed text-foreground/90">
      {blocks.flatMap((b, i) => {
        if (i % 2 === 1) return [<pre key={"c" + i} className="overflow-x-auto rounded-lg bg-code p-3 font-mono text-[13px] leading-relaxed text-foreground"><code>{b.replace(/\n$/, "")}</code></pre>];
        return b.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p, j) => <p key={`p${i}-${j}`}>{inline(p, `${i}-${j}-`)}</p>);
      })}
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
