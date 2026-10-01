import Link from "next/link";
import type { Metadata } from "next";
import { templates } from "@/content/templates";
import Live from "@/components/Live";

export const metadata: Metadata = {
  title: "Templates de site",
  description: "Sites completos prontos para usar como base ou modelo de teste.",
};

export default function TemplatesPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Templates de site</h1>
        <p className="mt-3 text-lg text-muted">
          Sites inteiros, com HTML e CSS já estruturados — use como modelo de teste ou ponto de partida real para o seu projeto.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {templates.map((t) => (
          <Link key={t.slug} href={`/templates/${t.slug}`} className="block overflow-hidden rounded-xl border border-border bg-surface hover:border-css">
            <div className="pointer-events-none h-56 overflow-hidden border-b border-border">
              <Live doc={t.code} height={700} />
            </div>
            <div className="p-4">
              <p className="font-semibold text-foreground">{t.title}</p>
              <p className="mt-1 text-sm text-muted">{t.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-muted">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
