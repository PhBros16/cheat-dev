import Link from "next/link";
import type { Metadata } from "next";
import { guides } from "@/content/guides";

export const metadata: Metadata = {
  title: "Guias e tutoriais",
  description: "Tutoriais completos, passo a passo, com código pronto para copiar.",
};

const LEVEL_COLOR: Record<string, string> = {
  "iniciante": "bg-ok-bg text-ok-fg",
  "intermediário": "bg-info-bg text-info-fg",
  "avançado": "bg-warn-bg text-warn-fg",
};

export default function GuiasPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Guias e tutoriais</h1>
        <p className="mt-3 text-lg text-muted">
          Passo a passo completo, com código pronto pra copiar — não só o comando isolado, mas o caminho inteiro até funcionar.
        </p>
      </div>

      <div className="mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.slug} href={`/guias/${g.slug}`} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 hover:border-css">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${LEVEL_COLOR[g.level]}`}>{g.level}</span>
              <span className="text-xs text-muted">{g.minutes} min de leitura</span>
            </div>
            <p className="font-display text-lg font-semibold text-foreground">{g.title}</p>
            <p className="text-sm text-muted">{g.summary}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {g.tags.map((t) => (
                <span key={t} className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-muted">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
