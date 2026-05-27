import { FinancialPage } from "@/components/admin/financial-page";

export const metadata = {
  title: "Controle Financeiro — Gurgel Team",
  description:
    "Receitas, custos, contas a receber e a pagar, inadimplência e performance financeira do kartódromo.",
};

export default function AdminFinanceiroPage() {
  return <FinancialPage />;
}
