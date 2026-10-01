"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Marca o link ativo e abre os <details> que o contêm (sem re-renderizar a árvore inteira). */
export default function SidebarActive() {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.querySelector("nav[data-sidebar]");
    if (!nav) return;
    nav.querySelectorAll('a[data-active="true"]').forEach((a) => a.removeAttribute("data-active"));

    const open = (el: Element | null) => {
      if (el instanceof HTMLDetailsElement) el.open = true;
    };
    const [seg1, seg2] = pathname.split("/").filter(Boolean);
    if (seg1) open(nav.querySelector(`details[data-lang="${seg1}"]`));
    if (seg1 && seg2) open(nav.querySelector(`details[data-cat="${seg1}/${seg2}"]`));

    const link = nav.querySelector(`a[href="${pathname}"]`);
    if (link) {
      link.setAttribute("data-active", "true");
      let p = link.parentElement;
      while (p && p !== nav) {
        open(p);
        p = p.parentElement;
      }
      link.scrollIntoView({ block: "nearest" });
    }
  }, [pathname]);

  return null;
}
