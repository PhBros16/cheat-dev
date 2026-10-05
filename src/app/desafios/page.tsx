import type { Metadata } from "next";
import Hub from "@/components/hub/Hub";
import { CHALLENGES } from "@/content/challenges";

export const metadata: Metadata = {
  title: "Desafios — roleta de treino de HTML, CSS, JavaScript e SQL",
  description:
    "Treine de verdade: gire a roleta e resolva desafios práticos de HTML, CSS, JavaScript e SQL do básico ao chefe, com testes automáticos, XP, patentes e sequência diária.",
};

export default function DesafiosPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">🎲 Desafios</h1>
        <p className="mt-3 text-lg text-muted">
          {CHALLENGES.length} desafios práticos para treinar HTML, CSS, JavaScript e SQL. Escreva o código, rode os testes automáticos e suba de patente, do básico até os desafios chefe.
        </p>
      </div>
      <div className="mt-8 max-w-7xl"><Hub /></div>
    </div>
  );
}
