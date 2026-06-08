import type { Metadata } from "next";
import { AdminDashboardPage } from "@/components/admin/admin-dashboard-page";

export const metadata: Metadata = {
  title: "Painel Administrativo — Gurgel Team",
  description:
    "Dashboard operacional: alunos, agenda, karts, telemetria e financeiro.",
};

export default function AdminPage() {
  return <AdminDashboardPage />;
}
