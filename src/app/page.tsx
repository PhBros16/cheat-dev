import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import EntryCard from "@/components/EntryCard";
import HomeLists from "@/components/HomeLists";
import { languages, countEntries, totalEntries, popularEntries } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";

const TRY = ["borda embaixo", "margem na direita", "transição de cor", "centralizar div", "remover item do array", "juntar tabelas"];

const SECTIONS = [
  { href: "/guias", title: "Guias e tutoriais", text: "Passo a passo completo, com código pronto para copiar." },
  { href: "/snippets", title: "Snippets prontos", text: "Botões, cards, modais, menus… com preview ao vivo." },
  { href: "/templates", title: "Templates de site", text: "Sites inteiros para testar ou usar de ponto de partida." },
];

export default function Home() {
  const popular = popularEntries();

  return (
    <div className="px-4 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {totalEntries()} comandos · guias · snippets · templates
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          Caramba, qual é aquele comando mesmo?
        </h1>
        <p className="mt-4 text-balance text-lg text-muted">
          Descreva do seu jeito, tipo &ldquo;borda embaixo&rdquo;, e a gente acha o código.
        </p>
        <div className="mt-8 w-full">
          <SearchBox variant="hero" />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
          <span className="text-muted">Tente:</span>
          {TRY.map((t) => (
            <Link key={t} href={`/busca?q=${encodeURIComponent(t)}`} className="rounded-full border border-border px-3 py-0.5 text-muted hover:text-foreground">
              {t}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
        {languages.map((language) => {
          const style = langStyles[language.slug];
          return (
            <Link key={language.slug} href={`/${language.slug}`} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-4 transition-transform hover:-translate-y-0.5">
              <span className={`h-1.5 w-6 rounded-full ${style.dot}`} />
              <span className="font-display text-lg font-semibold text-foreground">{language.title}</span>
              <span className="text-xs text-muted">{countEntries(language)} comandos</span>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-xl border border-border bg-surface-muted p-4 hover:border-css">
            <p className="font-display font-semibold text-foreground">{s.title}</p>
            <p className="mt-1 text-sm text-muted">{s.text}</p>
          </Link>
        ))}
      </div>

      <HomeLists />

      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="font-display text-lg font-semibold text-foreground">Populares agora</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {popular.map((item) => (
            <EntryCard key={item.href} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
