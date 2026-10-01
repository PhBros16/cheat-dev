import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { guides, getGuide } from "@/content/guides";
import CodeBlock from "@/components/CodeBlock";
import Playground from "@/components/Playground";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.summary };
}

export default async function GuidePage({ params }: P) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-2xl">
        <Link href="/guias" className="text-sm font-medium text-css hover:underline">
          ← Todos os guias
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">{guide.title}</h1>
        <p className="mt-3 text-lg text-muted">{guide.summary}</p>
        <p className="mt-1 text-sm text-muted">{guide.level} · {guide.minutes} min</p>

        <div className="mt-10 flex flex-col gap-10">
          {guide.steps.map((step, i) => (
            <section key={i}>
              <h2 className="font-display text-xl font-semibold text-foreground">{step.heading}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {step.text.map((p, j) => (
                  <p key={j} className="leading-relaxed text-foreground/90">{p}</p>
                ))}
              </div>
              {step.code && (
                <div className="mt-4">
                  <CodeBlock code={step.code.content} lang={step.code.lang} caption={step.code.caption} />
                </div>
              )}
              {step.note && (
                <p className="mt-3 rounded-lg bg-surface-muted px-4 py-3 text-sm text-muted">
                  💡 {step.note}
                </p>
              )}
            </section>
          ))}
        </div>

        {guide.finalCode && (
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="font-display text-xl font-semibold text-foreground">{guide.finalCode.label}</h2>
            <div className="mt-4">
              <Playground kind={guide.finalCode.lang} code={guide.finalCode.content} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
