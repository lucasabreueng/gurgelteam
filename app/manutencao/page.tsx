import type { Metadata } from "next";
import { ErrorPage } from "@/components/errors/error-page";
import { ERROR_PAGES } from "@/lib/error-pages";

export const metadata: Metadata = {
  title: "Em manutenção — Gurgel Team",
  description: "O sistema está temporariamente em manutenção.",
};

export default function MaintenancePage() {
  return <ErrorPage config={ERROR_PAGES.manutencao} pageKey="manutencao" />;
}
