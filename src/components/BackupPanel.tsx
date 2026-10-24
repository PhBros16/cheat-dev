"use client";

import { useEffect, useRef, useState } from "react";
import { applyBackup, backupFileName, buildBackup } from "@/lib/backup";

/** Seus dados ficam só neste navegador: aqui dá para guardar um backup, levar para outro aparelho e proteger contra limpeza automática. */
export default function BackupPanel() {
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);

  useEffect(() => { navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(null)); }, []);

  function exportar() {
    const blob = new Blob([JSON.stringify(buildBackup(localStorage), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = backupFileName(); a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg({ ok: true, text: "Backup salvo. Guarde o arquivo; para restaurar, use “Importar backup” em qualquer aparelho." });
  }

  async function importar(f: File | undefined) {
    if (!f) return;
    const r = applyBackup(await f.text(), localStorage);
    if (r.ok) { setMsg({ ok: true, text: `Backup restaurado (${r.keys} itens). Recarregando…` }); setTimeout(() => location.reload(), 900); }
    else setMsg({ ok: false, text: r.error });
    if (file.current) file.current.value = "";
  }

  async function proteger() {
    const ok = (await navigator.storage?.persist?.().catch(() => false)) ?? false;
    setPersisted(ok);
    setMsg(ok ? { ok: true, text: "Armazenamento protegido: o navegador não apagará seus dados sozinho." } : { ok: false, text: "O navegador não concedeu a proteção agora (alguns só concedem a sites instalados ou muito usados). Faça backups." });
  }

  const btn = "rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:border-muted";
  return (
    <section aria-label="Backup dos seus dados" className="rounded-2xl border border-border bg-surface p-5">
      <p className="font-semibold text-foreground">💾 Seus dados e backup</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">Seu progresso, favoritos e projetos ficam <b className="text-foreground">só neste navegador, neste aparelho</b> (não há conta nem servidor). Limpar os dados do site, usar outro navegador ou outro aparelho começa do zero. Guarde um backup e restaure onde quiser.</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={exportar} className={btn}>⬇️ Exportar backup</button>
        <button type="button" onClick={() => file.current?.click()} className={btn}>⬆️ Importar backup</button>
        <input ref={file} type="file" accept="application/json,.json" className="sr-only" aria-label="Escolher arquivo de backup" onChange={(e) => importar(e.target.files?.[0])} />
        {persisted !== true && <button type="button" onClick={proteger} className={btn}>🛡️ Proteger contra limpeza automática</button>}
        {persisted === true && <span className="text-xs font-semibold text-ok-fg">🛡️ Armazenamento protegido</span>}
      </div>
      {msg && <p role="status" className={`mt-3 rounded-lg p-2 text-xs ${msg.ok ? "bg-ok-bg text-ok-fg" : "bg-err-bg text-err-fg"}`}>{msg.text}</p>}
    </section>
  );
}
