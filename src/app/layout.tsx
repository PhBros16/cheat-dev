import type { Metadata, Viewport } from "next";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: {
    default: "cheat/dev — consulta rápida de HTML, CSS, JS e SQL",
    template: "%s · cheat/dev",
  },
  description:
    "Referência rápida e explicativa de HTML, CSS, JavaScript e SQL: sintaxe, exemplos e quando usar cada comando.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "cheat/dev",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "cheat/dev — consulta rápida de HTML, CSS, JS e SQL",
    description:
      "Sintaxe, exemplos e o \"quando usar\" de HTML, CSS, JavaScript e SQL — sem enrolação.",
    url: "https://cheat-dev.vercel.app",
    siteName: "cheat/dev",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1013",
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- app router root layout; loaded once for the whole app, not per-page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <TopBar />
        <div className="mx-auto flex max-w-[1400px]">
          <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-72 shrink-0 border-r border-border lg:block">
            <Sidebar />
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <PwaRegister />
      </body>
    </html>
  );
}
