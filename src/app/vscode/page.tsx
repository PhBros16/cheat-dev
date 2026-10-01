import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import { plain, prefixes, vscodeSnippets } from "@/content/vscode";

export const metadata: Metadata = {
  title: "Atalhos do VS Code",
  description:
    "Gatilhos prontos de HTML e CSS para o VS Code: digite cd-html ou cd-css e ganhe a base de um projeto estável. Inclui os atalhos Emmet mais úteis.",
};

const EMMET: { abrev: string; resultado: string }[] = [
  { abrev: "!", resultado: "Esqueleto HTML5 básico" },
  { abrev: "ul>li*5", resultado: "Lista com 5 itens" },
  { abrev: "nav>ul>li*3>a", resultado: "Menu com 3 links" },
  { abrev: "div.card>h2{Título}+p{Texto}", resultado: "div.card com título e parágrafo já preenchidos" },
  { abrev: "section#sobre.container", resultado: "section com id e classe" },
  { abrev: "a[href=#]{Clique}", resultado: "Link com atributo e texto" },
  { abrev: "lorem20", resultado: "20 palavras de texto de exemplo" },
  { abrev: "df · jcc · aic", resultado: "display:flex · justify-content:center · align-items:center" },
  { abrev: "m10 · p10-20", resultado: "margin:10px · padding:10px 20px" },
  { abrev: "w100p · posa · posr", resultado: "width:100% · position:absolute · position:relative" },
];

const PASSOS = [
  "Baixe html.json e css.json abaixo.",
  "No VS Code: Ctrl+Shift+P (Cmd+Shift+P no Mac) → \"Snippets: Configure Snippets\" → escolha html (ou css).",
  "Cole o conteúdo do arquivo baixado. Se o arquivo já tiver snippets seus, una os blocos { ... } dentro do mesmo objeto.",
  "Pronto: em um arquivo .html digite cd-html e Tab. Digite cd- para ver todos os gatilhos disponíveis.",
];

export default function VscodePage() {
  const groups = (["html", "css"] as const).map((lang) => ({
    lang,
    items: vscodeSnippets.filter((s) => s.lang === lang),
  }));

  const link =
    "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-foreground hover:border-css";

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Atalhos do VS Code</h1>
        <p className="mt-3 text-lg text-muted">
          Gatilhos padronizados para começar qualquer projeto: digite <code className="font-mono text-foreground">cd-html</code> ou{" "}
          <code className="font-mono text-foreground">cd-css</code>, aperte Tab e a base estável aparece. Todos começam com{" "}
          <code className="font-mono text-foreground">cd-</code> (também funcionam sem o hífen: <code className="font-mono text-foreground">cdhtml</code>).
        </p>
      </div>

      <div className="mt-8 max-w-5xl">
        <div className="flex flex-wrap gap-3">
          <a className={link} href="/vscode/baixar/html" download="html.json">⬇ html.json</a>
          <a className={link} href="/vscode/baixar/css" download="css.json">⬇ css.json</a>
          <a className={link} href="/vscode/baixar/projeto" download="cheatdev.code-snippets">⬇ Arquivo único de projeto (.code-snippets)</a>
        </div>
        <p className="mt-3 text-sm text-muted">
          O arquivo de projeto vai dentro de <code className="font-mono">.vscode/</code> e vale só para aquela pasta. Os dois .json valem em todos os projetos.
        </p>

        <h2 className="mt-10 font-display text-lg font-semibold text-foreground">Como instalar</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted">
          {PASSOS.map((p) => <li key={p}>{p}</li>)}
        </ol>

        {groups.map((g) => {
          const nomes = [...new Set(g.items.map((i) => i.group))];
          return (
            <section key={g.lang} className="mt-12">
              <h2 className="font-display text-2xl font-bold text-foreground">{g.lang.toUpperCase()}</h2>
              {nomes.map((nome) => (
                <div key={nome} className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{nome}</h3>
                  <div className="mt-3 flex flex-col gap-3">
                    {g.items.filter((i) => i.group === nome).map((s) => (
                      <details key={s.id} className="group rounded-xl border border-border bg-surface">
                        <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
                          <code className="rounded-md bg-surface-muted px-2 py-0.5 font-mono text-sm font-semibold text-foreground">
                            {prefixes(s.id)[0]}
                          </code>
                          <span className="font-semibold text-foreground">{s.title}</span>
                          <span className="w-full text-sm text-muted sm:w-auto sm:flex-1">{s.description}</span>
                        </summary>
                        <div className="border-t border-border p-3">
                          <CodeBlock code={plain(s.body)} lang={s.lang} />
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          );
        })}

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-foreground">Emmet (já vem no VS Code)</h2>
          <p className="mt-2 text-muted">Não precisa instalar nada: digite a abreviação e aperte Tab.</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted text-muted">
                <tr><th className="px-4 py-2 font-medium">Digite</th><th className="px-4 py-2 font-medium">Resultado</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {EMMET.map((e) => (
                  <tr key={e.abrev}>
                    <td className="px-4 py-2 font-mono text-foreground">{e.abrev}</td>
                    <td className="px-4 py-2 text-muted">{e.resultado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
