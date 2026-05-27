import type { QuickPartHistoryItem } from "@/lib/contracts/parts";

export function QuickPartHistory({ items }: { items: QuickPartHistoryItem[] }) {
  return (
    <section className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Histórico rápido do kart
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((h) => (
          <li key={h.id} className="text-xs text-neutral-700">
            <span className="font-bold text-[#0d1f3c]">{h.partName}</span>
            {" "}trocada há {h.daysAgo} por {h.mechanic} · {h.cost}
          </li>
        ))}
      </ul>
    </section>
  );
}
