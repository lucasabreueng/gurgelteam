import type { AvailableKartItem } from "@/lib/contracts/schedule";

export function AvailableKartsPanel({ karts }: { karts: AvailableKartItem[] }) {
  return (
    <section className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Karts disponíveis
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {karts.map((k) => (
          <li
            key={k.number}
            className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900 ring-1 ring-emerald-200/60"
          >
            Kart {String(k.number).padStart(2, "0")}
            {k.category ? (
              <span className="ml-1 text-[10px] font-semibold text-emerald-700/80">
                {k.category}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
