import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { templates, getTemplate } from "@/content/templates";
import Live from "@/components/Live";
import CodeBlock from "@/components/CodeBlock";
import DownloadButton from "@/components/DownloadButton";

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
          <DownloadButton code={template.code} filename={`${template.slug}.html`} />
        </div>

        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold text-foreground">Preview ao vivo</p>
          <Live doc={template.code} height={600} />
        </div>

        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold text-foreground">Código completo (um único arquivo .html)</p>
          <CodeBlock code={template.code} lang="html" />
        </div>
      </div>
    </div>
  );
}
