import type { Metadata } from "next";
import { CadastroPage } from "@/components/cadastro/cadastro-page";

export const metadata: Metadata = {
  title: "Criar cadastro — Área do Aluno | Gurgel Team",
  description:
    "Cadastre-se na área do aluno Gurgel Team e acompanhe sua evolução nas pistas.",
};

export default function CadastroRoutePage() {
  return <CadastroPage />;
}
