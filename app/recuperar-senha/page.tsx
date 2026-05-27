import type { Metadata } from "next";
import { PasswordRecoveryPage } from "@/components/password-recovery/password-recovery-page";

export const metadata: Metadata = {
  title: "Recuperar senha — Área do Aluno | Gurgel Team",
  description:
    "Recupere o acesso à sua conta na área do aluno Gurgel Team com código enviado por e-mail.",
};

export default function RecuperarSenhaRoutePage() {
  return <PasswordRecoveryPage />;
}
