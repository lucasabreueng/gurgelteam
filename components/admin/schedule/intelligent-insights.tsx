import { HiLightBulb } from "react-icons/hi2";
import type { ScheduleInsight } from "@/lib/contracts/schedule";

export function IntelligentInsights({ insights }: { insights: ScheduleInsight[] }) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <HiLightBulb className="h-5 w-5 text-accent" aria-hidden />
        <h3 className="text-sm font-bold text-[#0d1f3c]">Insights inteligentes</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {insights.map((i) => (
          <li
            key={i.id}
            className="rounded-xl bg-[#fafbfc] px-3 py-2.5 text-xs font-medium text-neutral-700 ring-1 ring-[rgba(17,17,17,0.06)]"
          >
            {i.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
