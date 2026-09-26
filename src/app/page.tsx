import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import EntryCard from "@/components/EntryCard";
import { languages, countEntries, totalEntries, popularEntries } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";

export default function Home() {
  const popular = popularEntries();

  return (
    <div className="px-4 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {totalEntries()} comandos e contando
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          Caramba, qual é aquele comando mesmo?
        </h1>
        <p className="mt-4 text-balance text-lg text-muted">
          Sintaxe, exemplos e o &ldquo;quando usar&rdquo; de HTML, CSS, JavaScript e SQL —
          sem enrolação.
        </p>

        <div className="mt-8 w-full">
          <SearchBox variant="hero" />
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
        {languages.map((language) => {
          const style = langStyles[language.slug];
          return (
            <Link
              key={language.slug}
              href={`/${language.slug}`}
              className={`flex flex-col gap-1 rounded-xl border border-border bg-surface p-4 transition-transform hover:-translate-y-0.5`}
            >
              <span className={`h-1.5 w-6 rounded-full ${style.dot}`} />
              <span className="font-display text-lg font-semibold text-foreground">
                {language.title}
              </span>
              <span className="text-xs text-muted">{countEntries(language)} comandos</span>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Populares agora
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {popular.map((item) => (
            <EntryCard key={item.href} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
