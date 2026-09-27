"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaRegister() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ambiente sem suporte (ou preview sandboxed) — ignora silenciosamente
      });
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error -- iOS Safari específico
      window.navigator.standalone === true;
    const dismissed = localStorage.getItem("pwa-install-dismissed") === "1";

    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      if (isStandalone || dismissed) return;
      setInstallEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    setVisible(false);
    setInstallEvent(null);
  }

  function handleDismiss() {
    localStorage.setItem("pwa-install-dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-xl sm:inset-x-auto sm:right-4">
      <span className="text-xl">📲</span>
      <div className="flex-1 text-sm">
        <p className="font-semibold text-foreground">Instalar o cheat/dev</p>
        <p className="text-muted">Acesso rápido, funciona até offline.</p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-lg px-2 py-1.5 text-xs text-muted hover:text-foreground"
      >
        Agora não
      </button>
      <button
        type="button"
        onClick={handleInstall}
        className="shrink-0 rounded-lg bg-css px-3 py-1.5 text-xs font-semibold text-white"
      >
        Instalar
      </button>
    </div>
  );
}
