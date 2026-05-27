import { ChecklistServiceMock } from "@/services/maintenance/checklistServiceMock";
import type { OverallInspectionStatus } from "@/lib/contracts/maintenance";


type Props = {
  ok: number;
  warn: number;
  fail: number;
  overall: OverallInspectionStatus;
};

const overallStyle: Record<OverallInspectionStatus, string> = {
  liberado: "bg-emerald-500 text-white",
  restrito: "bg-amber-500 text-white",
  bloqueado: "bg-red-500 text-white",
};

export function ChecklistSummary({ ok, warn, fail, overall }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#0d1f3c] px-3 py-2.5 text-white">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/65">
          Resumo
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          OK
          <span className="tabular-nums text-sm font-bold">{ok}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
          Atenção
          <span className="tabular-nums text-sm font-bold">{warn}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-red-400" aria-hidden />
          Reprov.
          <span className="tabular-nums text-sm font-bold">{fail}</span>
        </span>
      </div>
      <span
        className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${overallStyle[overall]}`}
      >
        {ChecklistServiceMock.getOverallStatusLabels()[overall]}
      </span>
    </div>
  );
}
