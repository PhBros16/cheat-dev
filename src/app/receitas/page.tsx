import Link from "next/link";
import type { Metadata } from "next";
import { recipes } from "@/content/recipes";

export const metadata: Metadata = {
  title: "Receitas — como fazer",
  description: "Como centralizar uma div, fazer menu fixo, modal, modo escuro, carrossel e mais: resultado ao vivo, código completo e botão para editar no Lab.",
};

const LEVEL: Record<string, string> = {
  "iniciante": "bg-ok-bg text-ok-fg",
  "intermediário": "bg-info-bg text-info-fg",
  "avançado": "bg-warn-bg text-warn-fg",
};

export default function ReceitasPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Receitas: como fazer X</h1>
        <p className="mt-3 text-lg text-muted">Você sabe o que quer, não sabe o nome técnico. Cada receita mostra o resultado funcionando, o código inteiro e abre no Lab para você mexer.</p>
      </div>
      <div className="mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {recipes.map((r) => (
          <Link key={r.slug} href={`/receitas/${r.slug}`} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 hover:border-css">
            <span className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${LEVEL[r.level]}`}>{r.level}</span>
            <p className="font-display text-lg font-semibold text-foreground">{r.title}</p>
            <p className="text-sm text-muted">{r.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
