import type { Metadata } from "next";
import { ResetPasswordPage } from "@/components/password-recovery/reset-password-page";

export const metadata: Metadata = {
  title: "Redefinir senha — Área do Aluno | Gurgel Team",
  description: "Defina uma nova senha para acessar sua conta na Gurgel Team.",
};

export default function RedefinirSenhaRoutePage() {
  return <ResetPasswordPage />;
}
