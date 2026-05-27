import { MaintenancePage } from "@/components/admin/maintenance-page";

export const metadata = {
  title: "Manutenção — Gurgel Team",
  description:
    "Gestão de ordens de serviço, preventivas, revisões e liberação técnica dos karts.",
};

export default function AdminMaintenancePage() {
  return <MaintenancePage />;
}
