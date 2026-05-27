import {
  HiArrowDownCircle,
  HiArrowUpCircle,
  HiCalendarDays,
  HiChartBar,
} from "react-icons/hi2";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { FinancialChartCard } from "../financial-chart-card";

function buildHighlightItems() {
  const h = CashFlowServiceMock.getPeriodHighlights();
  return [
    {
      id: "top-entry",
      label: "Maior entrada",
      detail: h.topEntry.label,
      value: h.topEntry.value,
      icon: HiArrowUpCircle,
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      id: "top-exit",
      label: "Maior saída",
      detail: h.topExit.label,
      value: h.topExit.value,
      icon: HiArrowDownCircle,
      tone: "text-red-700 bg-red-50",
    },
    {
      id: "best-day",
      label: "Melhor dia",
      detail: h.bestDay.label,
      value: h.bestDay.value,
      icon: HiCalendarDays,
      tone: "text-[#0d1f3c] bg-[rgba(13,31,60,0.06)]",
    },
    {
      id: "worst-day",
      label: "Pior dia",
      detail: h.worstDay.label,
      value: h.worstDay.value,
      icon: HiCalendarDays,
      tone: "text-red-700 bg-red-50",
    },
    {
      id: "positive",
      label: "Dias positivos",
      detail: "Saldo líquido positivo",
      value: String(h.positiveDays),
      icon: HiChartBar,
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      id: "negative",
      label: "Dias negativos",
      detail: "Saldo líquido negativo",
      value: String(h.negativeDays),
      icon: HiChartBar,
      tone: "text-amber-800 bg-amber-50",
    },
  ];
}

export function PeriodHighlights() {
  const highlightItems = buildHighlightItems();

  return (
    <FinancialChartCard title="Destaques do período" subtitle="Junho/2025">
      <ul className="grid gap-3 sm:grid-cols-2">
        {highlightItems.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              className={`flex items-start gap-3 rounded-xl p-4 ${item.tone}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {item.label}
                </p>
                <p className="mt-0.5 text-sm font-semibold">{item.detail}</p>
                <p className="mt-1 text-lg font-black tabular-nums">{item.value}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </FinancialChartCard>
  );
}
