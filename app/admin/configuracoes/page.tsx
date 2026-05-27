import type { Metadata } from "next";
import { AdminSettingsPage } from "@/components/admin/settings/admin-settings-page";

export const metadata: Metadata = {
  title: "Configurações — Gurgel Team",
  description:
    "Preferências, usuários, horários, planos, integrações e segurança do painel administrativo.",
};

export default function AdminConfiguracoesPage() {
  return <AdminSettingsPage />;
}
