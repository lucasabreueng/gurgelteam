import { Suspense } from "react";
import { FinancialPage } from "@/components/admin/financial-page";
import { AdminTabPanelSkeleton } from "@/components/admin/admin-page-skeletons";

export const metadata = {
  title: "Controle Financeiro — Gurgel Team",
  description:
    "Receitas, custos, contas a receber e a pagar, inadimplência e performance financeira do kartódromo.",
};

export default function AdminFinanceiroPage() {
  return (
    <Suspense fallback={<AdminTabPanelSkeleton />}>
      <FinancialPage />
    </Suspense>
  );
}
