import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { templates, getTemplate } from "@/content/templates";
import CodeBlock from "@/components/CodeBlock";
import TemplateStudio from "@/components/TemplateStudio";
import { applyTheme } from "@/content/themes";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  return { title: t.title, description: t.description };
}

export default async function TemplatePage({ params }: P) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();
  const variants = template.themes?.length
    ? template.themes.map((t) => ({ id: t.id, name: t.name, code: applyTheme(template.code, t) }))
    : [{ id: "padrao", name: "Padrão", code: template.code }];

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-4xl">
        <Link href="/templates" className="text-sm font-medium text-css hover:underline">
          ← Todos os templates
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{template.title}</h1>
            <p className="mt-2 text-lg text-muted">{template.description}</p>
          </div>
        </div>

        <div className="mt-8">
          <TemplateStudio
            slug={template.slug}
            variants={variants.map((v) => ({ id: v.id, name: v.name, doc: v.code }))}
            blocks={Object.fromEntries(variants.map((v) => [v.id, <CodeBlock key={v.id} code={v.code} lang="html" />]))}
          />
        </div>
      </div>
    </div>
  );
}
