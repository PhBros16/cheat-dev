import type { Metadata } from "next";
import LabLoader from "@/components/lab/LabLoader";

export const metadata: Metadata = {
  title: "Lab — teste código ao vivo",
  description:
    "Editor de HTML, CSS e JavaScript com preview imediato: teste em qualquer tamanho de tela, veja vários dispositivos ao mesmo tempo, use Emmet e compartilhe por link.",
};

export default function LabPage() {
  return <LabLoader />;
}
