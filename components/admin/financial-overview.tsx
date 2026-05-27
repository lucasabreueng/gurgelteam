import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";

export function FinancialOverview() {
  const financial = DashboardServiceMock.getFinancial();
  const items = [
    { label: "Receita mensal", value: financial.monthlyRevenue, highlight: true },
    { label: "Ticket médio", value: financial.ticketAvg },
    { label: "Aulas vendidas", value: financial.lessonsSold },
    { label: "Inadimplência", value: financial.delinquency },
    { label: "Crescimento", value: financial.growth, positive: true },
  ] as const;

  return (
    <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Financeiro executivo
      </p>
      <h3 className="mt-2 text-xl font-bold text-[#0d1f3c]">Visão do mês</h3>
      <p className="mt-1 text-sm text-neutral-600">Indicadores operacionais · sem ERP</p>

      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li
            key={item.label}
            className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${
              "highlight" in item && item.highlight
                ? "bg-accent/[0.06] ring-1 ring-accent/15"
                : "bg-[#fafbfc] ring-1 ring-[rgba(17,17,17,0.05)]"
            }`}
          >
            <span className="text-sm font-medium text-neutral-600">{item.label}</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                "positive" in item && item.positive
                  ? "text-emerald-700"
                  : "text-[#0d1f3c]"
              }`}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
