import type { KartScheduleStatus } from "@/lib/contracts/schedule";

const STYLES: Record<KartScheduleStatus, string> = {
  disponivel: "bg-emerald-100 text-emerald-800",
  reservado: "bg-sky-100 text-sky-900",
  em_treino: "bg-[#0d1f3c] text-white",
  manutencao: "bg-amber-100 text-amber-900",
  bloqueado_checklist: "bg-red-100 text-red-800",
};

const LABELS: Record<KartScheduleStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  em_treino: "Em treino",
  manutencao: "Manutenção",
  bloqueado_checklist: "Checklist pendente",
};

export function KartStatusBadge({ status }: { status: KartScheduleStatus }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
