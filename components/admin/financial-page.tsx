"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { FinancialTabKey } from "@/lib/contracts/finance/finance.types";
import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import { AdminShell } from "./admin-shell";
import { FinancialHeader } from "./financial/financial-header";
import { FinancialTabs } from "./financial/financial-tabs";
import type { CashFlowPeriodFilter } from "@/lib/contracts/cashflow";
import { CashFlowPeriodFilterBar } from "./financial/cash-flow/cash-flow-period-filter";
import { DrePeriodFilterBar } from "./financial/dre/dre-period-filter";

const TabLoading = () => (
  <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-8 text-sm font-medium text-neutral-500">
    Carregando…
  </div>
);

const FinancialOverviewTab = dynamic(
  () =>
    import("./financial/tabs/financial-overview-tab").then((m) => ({
      default: m.FinancialOverviewTab,
    })),
  { loading: TabLoading },
);

const ReceivablesTab = dynamic(
  () =>
    import("./financial/tabs/receivables-tab").then((m) => ({
      default: m.ReceivablesTab,
    })),
  { loading: TabLoading },
);

const PayablesTab = dynamic(
  () =>
    import("./financial/tabs/payables-tab").then((m) => ({
      default: m.PayablesTab,
    })),
  { loading: TabLoading },
);

const CashFlowTab = dynamic(
  () =>
    import("./financial/tabs/cash-flow-tab").then((m) => ({
      default: m.CashFlowTab,
    })),
  { loading: TabLoading },
);

const DreTab = dynamic(
  () =>
    import("./financial/tabs/dre-tab").then((m) => ({
      default: m.DreTab,
    })),
  { loading: TabLoading },
);

const PaymentDrawer = dynamic(
  () =>
    import("./financial/payment-drawer").then((m) => ({
      default: m.PaymentDrawer,
    })),
  { ssr: false },
);

const NewRevenueDrawer = dynamic(
  () =>
    import("./financial/billing/new-revenue-drawer").then((m) => ({
      default: m.NewRevenueDrawer,
    })),
  { ssr: false },
);

const NewExpenseDrawer = dynamic(
  () =>
    import("./financial/billing/new-expense-drawer").then((m) => ({
      default: m.NewExpenseDrawer,
    })),
  { ssr: false },
);

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
  const [revenueDrawerOpen, setRevenueDrawerOpen] = useState(false);
  const [expenseDrawerOpen, setExpenseDrawerOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dreFilter, setDreFilter] = useState<DrePeriodFilter>({ key: "current-month" });
  const [cashFlowFilter, setCashFlowFilter] = useState<CashFlowPeriodFilter>({
    key: "current-month",
  });
  const [receivablesFiltersOpen, setReceivablesFiltersOpen] = useState(false);
  const [payablesFiltersOpen, setPayablesFiltersOpen] = useState(false);
  const [receivableFilterCount, setReceivableFilterCount] = useState(0);
  const [payableFilterCount, setPayableFilterCount] = useState(0);

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
        return (
          <FinancialOverviewTab onTabChange={setActiveTab} />
        );
      case "receivables":
        return (
          <ReceivablesTab
            onAction={handleAction}
            filtersOpen={receivablesFiltersOpen}
            onFiltersOpenChange={setReceivablesFiltersOpen}
            onActiveFilterCountChange={setReceivableFilterCount}
          />
        );
      case "payables":
        return (
          <PayablesTab
            onAction={handleAction}
            filtersOpen={payablesFiltersOpen}
            onFiltersOpenChange={setPayablesFiltersOpen}
            onActiveFilterCountChange={setPayableFilterCount}
          />
        );
      case "cashflow":
        return <CashFlowTab filter={cashFlowFilter} onAction={handleAction} />;
      case "dre":
        return <DreTab filter={dreFilter} />;
      default:
        return null;
    }
  };

  const tabMeta = FinancialServiceMock.getTabMeta(activeTab);
  const showHeaderActions =
    activeTab === "overview" || activeTab === "receivables" || activeTab === "payables";

  const headerFilterCount =
    activeTab === "receivables"
      ? receivableFilterCount
      : activeTab === "payables"
        ? payableFilterCount
        : 0;

  const headerOnOpenFilters =
    activeTab === "receivables"
      ? () => setReceivablesFiltersOpen(true)
      : activeTab === "payables"
        ? () => setPayablesFiltersOpen(true)
        : undefined;

  const periodFilter =
    activeTab === "dre" ? (
      <DrePeriodFilterBar filter={dreFilter} onChange={setDreFilter} />
    ) : activeTab === "cashflow" ? (
      <CashFlowPeriodFilterBar filter={cashFlowFilter} onChange={setCashFlowFilter} />
    ) : undefined;

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
            actions={showHeaderActions ? undefined : periodFilter}
            onOpenFilters={headerOnOpenFilters}
            activeFilterCount={headerFilterCount}
            onNewCharge={showHeaderActions ? () => setRevenueDrawerOpen(true) : undefined}
            onNewExpense={showHeaderActions ? () => setExpenseDrawerOpen(true) : undefined}
            onRegisterPayment={showHeaderActions ? () => setPaymentOpen(true) : undefined}
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

      {paymentOpen ? (
        <PaymentDrawer
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onSuccess={handleAction}
        />
      ) : null}

      {revenueDrawerOpen ? (
        <NewRevenueDrawer
          open={revenueDrawerOpen}
          onClose={() => setRevenueDrawerOpen(false)}
          onSuccess={handleAction}
        />
      ) : null}

      {expenseDrawerOpen ? (
        <NewExpenseDrawer
          open={expenseDrawerOpen}
          onClose={() => setExpenseDrawerOpen(false)}
          onSuccess={handleAction}
        />
      ) : null}
    </>
  );
}
