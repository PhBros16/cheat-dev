import type { Metadata } from "next";
import Hub from "@/components/hub/Hub";
import { CHALLENGES } from "@/content/challenges";

export const metadata: Metadata = {
  title: "Desafios — trilhas e roleta de treino de HTML, CSS, JavaScript e SQL",
  description:
    "Aprenda praticando, do zero ao avançado: trilhas guiadas com mini-aulas e desafios de HTML, CSS, JavaScript e SQL, roleta personalizável, testes automáticos, XP, patentes e sequência diária.",
};

export default function DesafiosPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">🎲 Desafios</h1>
        <p className="mt-3 text-lg text-muted">
          {CHALLENGES.length} desafios práticos de HTML, CSS, JavaScript e SQL, organizados em trilhas do zero ao avançado. Cada passo tem uma mini-aula, testes automáticos e dica. Siga a trilha na ordem ou monte a sua roleta.
        </p>
      </div>
      <div className="mt-8 max-w-7xl"><Hub /></div>
    </div>
  );
}
