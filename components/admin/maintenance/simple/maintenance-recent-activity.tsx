import type { MaintenanceActivity } from "@/lib/contracts/maintenance/simple";

const KIND_DOT: Record<MaintenanceActivity["kind"], string> = {
  inspecao: "bg-sky-500",
  manutencao_aberta: "bg-amber-500",
  manutencao_concluida: "bg-emerald-500",
  checklist: "bg-violet-500",
};

type Props = { items: MaintenanceActivity[] };

export function MaintenanceRecentActivity({ items }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
      <h2 className="text-base font-bold text-[#0d1f3c]">Histórico recente</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Inspeções e manutenções mais recentes da frota.
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${KIND_DOT[item.kind]}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#0d1f3c]">
                Kart {String(item.kartNumber).padStart(2, "0")} — {item.title}
              </p>
              <p className="text-[11px] text-neutral-500">
                {item.statusLabel} — {item.when}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
