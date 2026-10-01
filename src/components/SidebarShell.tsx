"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setNavOpen, useNavOpen } from "@/lib/store";

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const open = useNavOpen();
  const pathname = usePathname();

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`fixed bottom-0 left-0 top-[57px] z-40 w-72 overflow-y-auto border-r border-border bg-background transition-transform lg:sticky lg:bottom-auto lg:h-[calc(100vh-57px)] lg:shrink-0 lg:translate-x-0 lg:visible ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        {children}
      </aside>
    </>
  );
}
