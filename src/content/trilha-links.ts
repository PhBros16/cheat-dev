import { TRACKS, type Track } from "@/content/tracks";

/** Liga cada trilha de desafios aos guias e receitas que ensinam o mesmo assunto (slugs de /guias/<slug> e /receitas/<slug>).
    O validador de integridade confere que todos os ids e slugs existem. */
export type TrackLinks = { guias?: string[]; receitas?: string[] };
export const TRACK_LINKS: Record<string, TrackLinks> = {
  "html-comecando": { guias: ["publicar-site-github-vercel"] },
  "html-estrutura": { receitas: ["faq-acordeao"] },
  "html-formularios": { guias: ["formulario-de-login"] },
  "html-qualidade": { receitas: ["abas-tabs", "modal-com-dialog"] },
  "css-caixa": { receitas: ["card-com-hover"] },
  "css-layout": { guias: ["flexbox-do-zero", "layout-com-grid"], receitas: ["centralizar-div", "menu-fixo-no-topo", "galeria-de-cards-responsiva"] },
  "css-responsivo": { receitas: ["galeria-de-cards-responsiva", "carrossel-com-scroll-snap"] },
  "css-efeitos": { receitas: ["card-com-hover", "tooltip-so-com-css", "skeleton-loading", "revelar-ao-rolar"] },
  "css-projeto": { guias: ["layout-com-grid"] },
  "js-dom": { guias: ["formulario-de-login"], receitas: ["modo-escuro-com-botao", "botao-com-loading", "abas-tabs", "modal-com-dialog"] },
  "js-assincrono": { guias: ["consumindo-api-com-fetch"], receitas: ["botao-com-loading"] },
  "sql-selecionar": { guias: ["sql-da-tabela-ao-relatorio"] },
  "sql-filtrar": { guias: ["sql-da-tabela-ao-relatorio"] },
  "sql-agregar": { guias: ["sql-da-tabela-ao-relatorio"] },
};

export const tracksForGuide = (slug: string): Track[] => TRACKS.filter((t) => TRACK_LINKS[t.id]?.guias?.includes(slug));
export const tracksForRecipe = (slug: string): Track[] => TRACKS.filter((t) => TRACK_LINKS[t.id]?.receitas?.includes(slug));
