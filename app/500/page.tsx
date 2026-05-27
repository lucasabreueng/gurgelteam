import type { Metadata } from "next";
import { ErrorPage } from "@/components/errors/error-page";
import { ERROR_PAGES } from "@/lib/error-pages";

export const metadata: Metadata = {
  title: "Erro no servidor — Gurgel Team",
  description: "Ocorreu um erro interno. Tente novamente mais tarde.",
};

export default function ServerErrorPage() {
  return <ErrorPage config={ERROR_PAGES["500"]} pageKey="500" />;
}
