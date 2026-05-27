import type { Metadata } from "next";
import { ErrorPage } from "@/components/errors/error-page";
import { ERROR_PAGES } from "@/lib/error-pages";

export const metadata: Metadata = {
  title: "Acesso negado — Gurgel Team",
  description: "Você não tem permissão para acessar este conteúdo.",
};

export default function ForbiddenPage() {
  return <ErrorPage config={ERROR_PAGES["403"]} pageKey="403" />;
}
