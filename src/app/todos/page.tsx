import type { Metadata } from "next";
import { buildSearchIndex, totalEntries } from "@/lib/content";
import AllCommandsBrowser from "@/components/AllCommandsBrowser";

export const metadata: Metadata = {
  title: "Todos os comandos",
  description: "Lista completa e filtrável de todos os comandos de HTML, CSS, JavaScript e SQL.",
};

export default function TodosPage() {
  const index = buildSearchIndex();

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Todos os comandos
        </h1>
        <p className="mt-3 text-lg text-muted">
          {totalEntries()} comandos catalogados até agora. Filtre por linguagem ou use a
          busca (⌘K) para achar direto.
        </p>
      </div>

      <div className="mt-8 max-w-5xl">
        <AllCommandsBrowser index={index} />
      </div>
    </div>
  );
}
