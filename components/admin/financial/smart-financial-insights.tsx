import { HiLightBulb } from "react-icons/hi2";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

export function SmartFinancialInsights() {
  const insights = FinancialServiceMock.getSmartInsights();

  return (
    <section className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-white p-5 shadow-sm md:p-6">
      <div className="flex items-center gap-2">
        <HiLightBulb className="h-5 w-5 text-accent" aria-hidden />
        <h3 className="text-sm font-bold text-[#0d1f3c]">
          Insights financeiros
        </h3>
      </div>
      <ul className="mt-4 space-y-3">
        {insights.map((text) => (
          <li
            key={text}
            className="rounded-xl bg-white/80 px-4 py-3 text-sm leading-relaxed text-[#0d1f3c] ring-1 ring-[rgba(17,17,17,0.06)]"
          >
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
