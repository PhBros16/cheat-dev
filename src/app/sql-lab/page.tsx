import type { Metadata } from "next";
import SqlLabLoader from "@/components/sql/SqlLabLoader";

export const metadata: Metadata = {
  title: "SQL Lab — pratique SQL no navegador",
  description:
    "Rode SQL de verdade no navegador, sem instalar nada: bancos de exemplo (loja, escola, RH), aulas guiadas, exercícios com correção automática e plano de execução.",
};

export default function SqlLabPage() {
  return <SqlLabLoader />;
}
