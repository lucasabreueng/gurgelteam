"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { FinancialTabKey } from "@/lib/contracts/finance/finance.types";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import { AdminShell } from "./admin-shell";
import { FinancialHeader } from "./financial/financial-header";
import { FinancialTabs } from "./financial/financial-tabs";
import { PaymentDrawer } from "./financial/payment-drawer";
import { FinancialOverviewTab } from "./financial/tabs/financial-overview-tab";
import { ReceivablesTab } from "./financial/tabs/receivables-tab";
import { PayablesTab } from "./financial/tabs/payables-tab";
import { CashFlowTab } from "./financial/tabs/cash-flow-tab";

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  financeiro: "/admin/financeiro",
  configuracoes: "/admin/configuracoes",
};

export function FinancialPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FinancialTabKey>("overview");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router],
  );

  const handleAction = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 5000);
  }, []);

  const tabContent = () => {
    switch (activeTab) {
      case "overview":
        return <FinancialOverviewTab />;
      case "receivables":
        return <ReceivablesTab onAction={handleAction} />;
      case "payables":
        return <PayablesTab onAction={handleAction} />;
      case "cashflow":
        return <CashFlowTab />;
      default:
        return null;
    }
  };

  const tabMeta = FinancialServiceMock.getTabMeta(activeTab);

  return (
    <>
      <AdminShell
        activeNav="financeiro"
        onNav={onNav}
        mobileTitle={tabMeta.title}
        mainClassName=""
        pageHeader={
          <FinancialHeader
            title={tabMeta.title}
            subtitle={tabMeta.subtitle}
            onNewCharge={() => {
              setActiveTab("receivables");
              handleAction("Nova cobrança criada (mock).");
            }}
            onNewExpense={() => {
              setActiveTab("payables");
              handleAction("Nova despesa registrada (mock).");
            }}
            onRegisterPayment={() => setPaymentOpen(true)}
            onExport={() => handleAction("Relatório exportado (mock).")}
          />
        }
        fixedSubHeader={
          <FinancialTabs active={activeTab} onChange={setActiveTab} />
        }
      >
        {feedback ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900"
          >
            {feedback}
          </p>
        ) : null}

        <div
          role="tabpanel"
          id={`financial-panel-${activeTab}`}
          aria-labelledby={`financial-tab-${activeTab}`}
          className="admin-page-stack pb-10 lg:pb-12"
        >
          {tabContent()}
        </div>
      </AdminShell>

      <PaymentDrawer
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handleAction}
      />
    </>
  );
}
