"use client";

import { useEffect, useRef } from "react";
import { EditorState, Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { indentWithTab } from "@codemirror/commands";
import { acceptCompletion, snippet, type CompletionContext } from "@codemirror/autocomplete";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { abbreviationTracker, expandAbbreviation, emmetConfig, type EmmetKnownSyntax } from "@emmetio/codemirror6-plugin";
import { prefixes, toCm, vscodeSnippets } from "@/content/vscode";

export type Lang = "html" | "css" | "js";

function snippetSource(lang: Lang) {
  const list = vscodeSnippets.filter((s) => s.lang === (lang === "css" ? "css" : "html"));
  return (ctx: CompletionContext) => {
    if (lang === "js") return null;
    const m = ctx.matchBefore(/cd-?[\w]*/);
    if (!m || (m.from === m.to && !ctx.explicit)) return null;
    return {
      from: m.from,
      options: list.map((s) => ({
        label: prefixes(s.id)[0],
        detail: s.title,
        info: s.description,
        type: "text",
        boost: 99,
        apply: snippet(toCm(s.body)),
      })),
      validFor: /^cd-?[\w]*$/,
    };
  };
}

/** Estilo VS Code: digitou o gatilho exato (ex.: cd-card) e apertou Tab, o snippet entra. */
function tabTrigger(lang: Lang) {
  const list = vscodeSnippets.filter((s) => s.lang === (lang === "css" ? "css" : "html"));
  return (view: EditorView) => {
    if (lang === "js") return false;
    const sel = view.state.selection.main;
    if (!sel.empty) return false;
    const line = view.state.doc.lineAt(sel.head);
    const m = line.text.slice(0, sel.head - line.from).match(/(?:^|[^\w-])(cd-?\w+)$/);
    if (!m) return false;
    const sn = list.find((s) => prefixes(s.id).includes(m[1]));
    if (!sn) return false;
    snippet(toCm(sn.body))(view, null, sel.head - m[1].length, sel.head);
    return true;
  };
}

export default function Editor({
  lang, value, onChange, onRun, visible,
}: { lang: Lang; value: string; onChange: (v: string) => void; onRun: () => void; visible: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const cb = useRef({ onChange, onRun });
  useEffect(() => { cb.current = { onChange, onRun }; });
  useEffect(() => { if (visible) view.current?.requestMeasure(); }, [visible]);

  useEffect(() => {
    const syntax = (lang === "html" ? "html" : "css") as unknown as EmmetKnownSyntax;
    const source = snippetSource(lang); // uma única instância: o CodeMirror identifica a fonte por referência
    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        oneDark,
        lang === "html" ? html() : lang === "css" ? css() : javascript(),
        Prec.highest(
          keymap.of([
            { key: "Mod-Enter", run: () => (cb.current.onRun(), true) },
            { key: "Tab", run: tabTrigger(lang) },
            { key: "Tab", run: acceptCompletion },
            ...(lang !== "js" ? [{ key: "Tab", run: expandAbbreviation }] : []),
            indentWithTab,
          ])
        ),
        EditorState.languageData.of(() => [{ autocomplete: source }]),
        ...(lang !== "js" ? [emmetConfig.of({ syntax }), abbreviationTracker({ syntax })] : []),
        EditorView.lineWrapping,
        EditorView.theme({ "&": { height: "100%", fontSize: "13.5px" }, ".cm-scroller": { fontFamily: "var(--font-mono, ui-monospace, monospace)" } }),
        EditorView.updateListener.of((u) => { if (u.docChanged) cb.current.onChange(u.state.doc.toString()); }),
      ],
    });
    const v = new EditorView({ state, parent: host.current! });
    view.current = v;
    return () => v.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // valor vindo de fora (abrir template, restaurar, etc.)
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
  }, [value]);

  return <div ref={host} className="h-full min-h-0" style={{ display: visible ? "block" : "none" }} />;
}
