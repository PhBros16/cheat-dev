import Link from "next/link";
import type { Track } from "@/content/tracks";

/** "Pratique isso": leva das páginas de guia e receita para as trilhas de desafios sobre o mesmo assunto. */
export default function PracticeBox({ tracks }: { tracks: Track[] }) {
  if (!tracks.length) return null;
  return (
    <aside aria-label="Pratique este assunto nos Desafios" className="mt-10 rounded-2xl border border-accent/40 bg-accent-soft p-5">
      <p className="font-display text-lg font-semibold text-foreground">🎯 Pratique isso nos Desafios</p>
      <p className="mt-1 text-sm text-muted">Aprendeu? Fixe resolvendo exercícios com testes automáticos, do básico ao avançado.</p>
      <ul className="mt-3 grid gap-2">
        {tracks.map((t) => (
          <li key={t.id}>
            <Link href={`/desafios#trilha-${t.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm hover:border-muted">
              <span><b className="text-foreground">{t.title}</b> <span className="text-muted">· {t.lang === "js" ? "JavaScript" : t.lang.toUpperCase()} · {t.ids.length} desafios</span></span>
              <span className="font-semibold text-accent-fg">Abrir trilha →</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
