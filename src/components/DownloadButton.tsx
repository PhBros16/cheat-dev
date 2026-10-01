"use client";

export default function DownloadButton({ code, filename }: { code: string; filename: string }) {
  function download() {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex items-center gap-1.5 rounded-lg bg-css px-3.5 py-2 text-sm font-semibold text-white hover:bg-css/90"
    >
      ⬇ Baixar arquivo .html
    </button>
  );
}
