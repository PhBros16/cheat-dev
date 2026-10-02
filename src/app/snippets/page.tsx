import type { Metadata } from "next";
import { snippets } from "@/content/snippets";
import SnippetBrowser from "@/components/SnippetBrowser";

export const metadata: Metadata = {
  title: "Snippets prontos",
  description: "Mais de 60 componentes de interface prontos (formulários, navegação, seções, cards, tabelas, animações) com preview ao vivo e variações de estilo.",
};

export default function SnippetsPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Snippets prontos</h1>
        <p className="mt-3 text-lg text-muted">
          Componentes comuns já funcionando, organizados por categoria. Copie o código ou abra no Lab para editar ao vivo em qualquer tamanho de tela.
        </p>
      </div>
      <div className="mt-6"><SnippetBrowser items={snippets} basePath="/snippets" noun="snippets" /></div>
    </div>
  );
}
