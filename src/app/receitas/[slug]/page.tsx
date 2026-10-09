import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRecipe, recipeDoc, recipes } from "@/content/recipes";
import CodeBlock from "@/components/CodeBlock";
import Live from "@/components/Live";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const r = getRecipe(slug);
  return r ? { title: r.title, description: r.summary } : {};
}

export default async function RecipePage({ params }: P) {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) notFound();
  const { html, css, js } = r.project;

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <Link href="/receitas" className="text-sm font-medium text-css-fg hover:underline">← Todas as receitas</Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">{r.title}</h1>
        <p className="mt-3 text-lg text-muted">{r.summary}</p>

        <div className="mt-8"><Live doc={recipeDoc(r.project)} height={360} /></div>

        <h2 className="mt-10 font-display text-xl font-semibold text-foreground">Como funciona</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {r.how.map((h, i) => <li key={i} className="leading-relaxed text-foreground/90">• {h}</li>)}
        </ul>

        <h2 className="mt-10 font-display text-xl font-semibold text-foreground">Código completo</h2>
        <div className="mt-4 flex flex-col gap-4">
          <CodeBlock code={html} lang="html" caption="HTML" />
          <CodeBlock code={css} lang="css" caption="CSS" />
          {js.trim() && <CodeBlock code={js} lang="js" caption="JavaScript" />}
        </div>
      </div>
    </div>
  );
}
