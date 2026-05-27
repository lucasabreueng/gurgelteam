import type { KartOwnership, KartStatus } from "@/lib/contracts/karts";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";
import { KartsServiceMock } from "@/services/karts/kartsServiceMock";

function statusBadgeClass(status: KartStatus) {
  switch (status) {
    case "disponivel":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200/70";
    case "em_treino":
      return "bg-sky-50 text-sky-900 ring-sky-200/70";
    case "manutencao":
    case "aguardando_peca":
      return "bg-amber-50 text-amber-900 ring-amber-200/70";
    case "reservado":
    case "preparacao":
      return "bg-violet-50 text-violet-900 ring-violet-200/70";
    default:
      return "bg-neutral-100 text-neutral-700 ring-neutral-200/70";
  }
}

function ownershipLabel(ownership: KartOwnership, ownerName?: string) {
  if (ownership === "client" && ownerName) {
    return `Cliente · ${ownerName}`;
  }
  if (ownership === "client") {
    return "Cliente";
  }
  return "Próprio";
}

export function KartStatusGrid() {
  const kartFleet = DashboardServiceMock.getKartFleet();

  return (
    <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7">
      <h3 className="text-xl font-bold text-[#0d1f3c]">Gestão de karts</h3>
      <p className="mt-1 text-sm text-neutral-600">Paddock · status em tempo real</p>

      <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {kartFleet.map((k) => (
          <li
            key={k.id}
            className="flex flex-col gap-2 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-2xl font-bold tabular-nums text-[#0d1f3c]">
                {String(k.number).padStart(2, "0")}
              </p>
              <span
                className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ring-1 ${statusBadgeClass(k.status)}`}
              >
                {KartsServiceMock.getStatusLabels()[k.status]}
              </span>
            </div>
            <p className="text-sm font-semibold text-neutral-800">{k.category}</p>
            <p className="text-[12px] text-neutral-600">
              {ownershipLabel(k.ownership, k.ownerName)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
