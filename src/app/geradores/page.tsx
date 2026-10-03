import type { Metadata } from "next";
import Generators from "@/components/Generators";

export const metadata: Metadata = {
  title: "Geradores de CSS",
  description: "Gerador de sombra (box-shadow), gradiente, flexbox, grid, curva de animação (cubic-bezier) e border-radius: ajuste visualmente e copie o CSS.",
};

export default function GeradoresPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Geradores de CSS</h1>
        <p className="mt-3 text-lg text-muted">Ajuste com controles e veja o resultado na hora. Quando gostar, copie o CSS ou leve para o Lab.</p>
      </div>
      <div className="mt-8 max-w-6xl"><Generators /></div>
    </div>
  );
}
