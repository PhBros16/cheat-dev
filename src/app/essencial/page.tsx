import type { Metadata } from "next";
import { ESSENCIAL } from "@/content/essencial";
import { resolveLink } from "@/lib/essLinks";
import EssencialTracker from "@/components/EssencialTracker";

export const metadata: Metadata = {
  title: "Essencial — o que você não pode deixar de aprender",
  description:
    "O conhecimento primordial de HTML, CSS, JavaScript, SQL, Git e qualidade, em ordem, com o risco de pular cada passo e uma tarefa prática. Acompanhe seu progresso.",
};

export default function EssencialPage() {
  const tracks = ESSENCIAL.map((t) => ({
    ...t,
    steps: t.steps.map((s) => ({ ...s, links: s.links.map(resolveLink).filter((l): l is NonNullable<typeof l> => !!l) })),
  }));
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">★ Essencial</h1>
        <p className="mt-3 text-lg text-muted">
          Entre milhares de comandos, estes são os que você <b className="text-foreground">não pode deixar de dominar</b>. Cada passo diz por que importa, o que acontece se você pular e uma tarefa para fazer agora, com os comandos, guias e ferramentas do site para praticar.
        </p>
        <p className="mt-2 text-sm text-muted">Ordem sugerida: HTML → CSS → JavaScript → Git e deploy → SQL → Qualidade. Os comandos desta lista ganham a etiqueta ★ Essencial no site.</p>
      </div>
      <div className="mt-8 max-w-4xl"><EssencialTracker tracks={tracks} /></div>
    </div>
  );
}
