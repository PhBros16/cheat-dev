import type { Metadata } from "next";
import { templates } from "@/content/templates";
import SnippetBrowser from "@/components/SnippetBrowser";

export const metadata: Metadata = {
  title: "Templates de site",
  description: "Sites completos prontos (blog, loja, SaaS, restaurante, agência, link na bio, documentação, evento) com vários estilos visuais cada um.",
};

export default function TemplatesPage() {
  const items = templates.map((t) => ({
    slug: t.slug, title: t.title, category: t.category ?? "Páginas", code: t.code,
    description: `${t.description}${t.themes && t.themes.length > 1 ? ` · ${t.themes.length} estilos` : ""}`,
  }));
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Templates de site</h1>
        <p className="mt-3 text-lg text-muted">
          Sites inteiros, responsivos, em um único arquivo. Escolha o tipo de negócio, troque o estilo visual na hora e abra no Lab para editar.
        </p>
      </div>
      <div className="mt-6"><SnippetBrowser items={items} basePath="/templates" noun="templates" /></div>
    </div>
  );
}
