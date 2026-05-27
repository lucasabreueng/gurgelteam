import { FinancialServiceMock } from "@/services/finance/financialServiceMock";


const IMPACT_STYLES = {
  baixo: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  medio: "bg-amber-50 text-amber-900 ring-amber-200/60",
  alto: "bg-red-50 text-red-800 ring-red-200/60",
} as const;

export function ExpensesSection() {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <h2 className="text-lg font-bold text-[#0d1f3c]">Saídas</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Custos operacionais · tendência mensal
      </p>
      <ul className="mt-5 space-y-3">
        {FinancialServiceMock.getExpenseCategories().map((cat) => (
          <li
            key={cat.id}
            className="flex flex-col gap-2 rounded-xl border border-[rgba(17,17,17,0.06)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <p className="font-bold text-[#0d1f3c]">{cat.label}</p>
              <span
                className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ring-1 ${IMPACT_STYLES[cat.impact]}`}
              >
                Impacto {cat.impact}
              </span>
            </div>
            <div className="flex items-center gap-4 sm:text-right">
              <p className="text-lg font-bold tabular-nums text-[#0d1f3c]">
                {cat.monthlyCost}
              </p>
              <span
                className={`text-[10px] font-bold ${
                  cat.trendPositive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {cat.trend}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
