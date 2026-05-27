import type { Metadata } from "next";
import { ErrorPage } from "@/components/errors/error-page";
import { ERROR_PAGES } from "@/lib/error-pages";

export const metadata: Metadata = {
  title: "Página não encontrada — Gurgel Team",
  description: "A página que você procura não foi encontrada.",
};

export default function NotFound() {
  return <ErrorPage config={ERROR_PAGES["404"]} pageKey="404" />;
}
