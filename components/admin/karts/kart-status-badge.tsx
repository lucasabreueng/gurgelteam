import type { KartStatus } from "@/lib/contracts/karts";
import { KartsServiceMock } from "@/services/karts/kartsServiceMock";


export function statusStyle(status: KartStatus) {
  switch (status) {
    case "disponivel":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200/60";
    case "em_treino":
      return "bg-sky-50 text-sky-900 ring-sky-200/60";
    case "reservado":
      return "bg-violet-50 text-violet-900 ring-violet-200/60";
    case "manutencao":
    case "aguardando_peca":
      return "bg-amber-50 text-amber-950 ring-amber-200/60";
    case "lavagem":
    case "preparacao":
      return "bg-blue-50 text-blue-900 ring-blue-200/60";
    default:
      return "bg-neutral-100 text-neutral-700 ring-neutral-200/60";
  }
}

export function KartStatusBadge({ status }: { status: KartStatus }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${statusStyle(status)}`}
    >
      {KartsServiceMock.getStatusLabels()[status]}
    </span>
  );
}
