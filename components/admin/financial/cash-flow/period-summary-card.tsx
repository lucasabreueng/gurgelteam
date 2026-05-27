import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { FinancialChartCard } from "../financial-chart-card";

function SummaryLine({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "green" | "red" | "navy";
}) {
  const valueClass =
    tone === "green"
      ? "text-emerald-700"
      : tone === "red"
        ? "text-red-700"
        : tone === "navy"
          ? "text-[#0d1f3c]"
          : "text-[#111]";

  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className={`font-semibold tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}

export function PeriodSummaryCard() {
  const s = CashFlowServiceMock.getPeriodSummary();

  return (
    <FinancialChartCard
      title="Resumo do período"
      subtitle="Junho/2025 · consolidação de entradas e saídas"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Entradas
          </p>
          <div className="mt-2 space-y-0.5 border-t border-emerald-100 pt-2">
            <SummaryLine label="Entradas operacionais" value={s.entries.operational} tone="green" />
            <SummaryLine label="Outras entradas" value={s.entries.other} tone="green" />
            <SummaryLine label="Total de entradas" value={s.entries.total} tone="green" />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-700">
            Saídas
          </p>
          <div className="mt-2 space-y-0.5 border-t border-red-100 pt-2">
            <SummaryLine label="Custos variáveis" value={s.exits.variable} tone="red" />
            <SummaryLine label="Custos fixos" value={s.exits.fixed} tone="red" />
            <SummaryLine label="Despesas operacionais" value={s.exits.operational} tone="red" />
            <SummaryLine label="Total de saídas" value={s.exits.total} tone="red" />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-[rgba(13,31,60,0.04)] px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c]">
            Resultado
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-[#0d1f3c]">
            {s.result}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Resultado do período</p>
        </div>
      </div>
    </FinancialChartCard>
  );
}
