import type { Metadata } from "next";
import { ErrorPage } from "@/components/errors/error-page";
import { ERROR_PAGES } from "@/lib/error-pages";

export const metadata: Metadata = {
  title: "Não autorizado — Gurgel Team",
  description: "Faça login para acessar esta área.",
};

export default function UnauthorizedPage() {
  return <ErrorPage config={ERROR_PAGES["401"]} pageKey="401" />;
}
