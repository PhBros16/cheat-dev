export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-5xl">📡</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
        Você está offline
      </h1>
      <p className="mt-2 max-w-sm text-muted">
        Essa página específica ainda não tinha sido aberta antes, então não ficou salva
        para uso offline. Comandos que você já visitou continuam disponíveis.
      </p>
    </div>
  );
}
