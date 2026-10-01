import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { snippets, getSnippet } from "@/content/snippets";
import Live from "@/components/Live";
import CodeBlock from "@/components/CodeBlock";

export function generateStaticParams() {
  return snippets.map((s) => ({ slug: s.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const s = getSnippet(slug);
  if (!s) return {};
  return { title: s.title, description: s.description };
}

export default async function SnippetPage({ params }: P) {
  const { slug } = await params;
  const snippet = getSnippet(slug);
  if (!snippet) notFound();

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <Link href="/snippets" className="text-sm font-medium text-css hover:underline">
          ← Todos os snippets
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground">{snippet.title}</h1>
        <p className="mt-2 text-lg text-muted">{snippet.description}</p>

        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold text-foreground">Preview ao vivo</p>
          <Live doc={snippet.code} height={340} />
        </div>

        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold text-foreground">Código completo</p>
          <CodeBlock code={snippet.code} lang="html" />
        </div>
      </div>
    </div>
  );
}
