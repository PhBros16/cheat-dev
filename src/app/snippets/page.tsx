import Link from "next/link";
import type { Metadata } from "next";
import { snippets } from "@/content/snippets";
import Live from "@/components/Live";

export const metadata: Metadata = {
  title: "Snippets prontos",
  description: "Componentes de interface prontos para copiar, com preview ao vivo.",
};

export default function SnippetsPage() {
  const categorias = [...new Set(snippets.map((s) => s.category))];

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Snippets prontos</h1>
        <p className="mt-3 text-lg text-muted">
          Componentes comuns — botões, cards, modais, navbar — já funcionando. Copie o código ou abra para editar ao vivo.
        </p>
      </div>

      {categorias.map((cat) => (
        <div key={cat} className="mx-auto mt-10 max-w-5xl">
          <h2 className="font-display text-lg font-semibold text-foreground">{cat}</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            {snippets.filter((s) => s.category === cat).map((s) => (
              <Link key={s.slug} href={`/snippets/${s.slug}`} className="block overflow-hidden rounded-xl border border-border bg-surface hover:border-css">
                <div className="pointer-events-none h-40 overflow-hidden border-b border-border">
                  <Live doc={s.code} height={220} />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-foreground">{s.title}</p>
                  <p className="mt-1 text-sm text-muted">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
