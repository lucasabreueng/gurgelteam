import type { Metadata } from "next";
import { ErrorPage } from "@/components/errors/error-page";
import { ERROR_PAGES } from "@/lib/error-pages";

export const metadata: Metadata = {
  title: "Sessão expirada — Gurgel Team",
  description: "Sua sessão expirou. Faça login novamente para continuar.",
};

export default function SessionExpiredPage() {
  return (
    <ErrorPage config={ERROR_PAGES["sessao-expirada"]} pageKey="sessao-expirada" />
  );
}
