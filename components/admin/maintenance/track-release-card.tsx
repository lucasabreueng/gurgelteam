import { HiCheckBadge } from "react-icons/hi2";
import type { MaintenanceOrderDetail } from "@/lib/contracts/maintenance";

export function TrackReleaseCard({
  tests,
}: {
  tests: MaintenanceOrderDetail["tests"];
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        tests.released
          ? "border-emerald-200/60 bg-emerald-50/50"
          : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc]"
      }`}
    >
      <dl className="grid gap-4 sm:grid-cols-2 text-sm">
        <div>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Teste realizado
          </dt>
          <dd className="mt-1 font-semibold text-[#0d1f3c]">
            {tests.performed ? "Sim" : "Não"}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Piloto do teste
          </dt>
          <dd className="mt-1 font-semibold text-[#0d1f3c]">{tests.pilot}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-neutral-700">
        <span className="font-bold text-neutral-500">Observações: </span>
        {tests.notes}
      </p>
      <div className="mt-5 flex items-center gap-3">
        {tests.released ? (
          <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white">
            <HiCheckBadge className="h-5 w-5" aria-hidden />
            Liberado para pista
          </span>
        ) : (
          <span className="text-sm font-semibold text-neutral-600">
            Aguardando aprovação final
          </span>
        )}
      </div>
    </div>
  );
}
