import type { Metadata } from "next";
import { LoginPage } from "@/components/login/login-page";

export const metadata: Metadata = {
  title: "Entrar — Área do Aluno | Gurgel Team",
  description:
    "Acesse sua conta na área do aluno Gurgel Team e acompanhe sua evolução nas pistas.",
};

export default function LoginRoutePage() {
  return <LoginPage />;
}
