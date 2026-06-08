import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";
import { HiFingerPrint } from "react-icons/hi2";


type Props = { responsible: string };

export function TechnicalSignature({ responsible }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Assinatura técnica</h2>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-[#fafbfc] px-3 py-2">
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Responsável
          </dt>
          <dd className="text-sm font-bold">{responsible}</dd>
        </div>
        <div className="rounded-lg bg-[#fafbfc] px-3 py-2">
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Mecânico
          </dt>
          <dd className="text-sm font-bold">{NewMaintenanceServiceMock.getSignature().mechanic}</dd>
        </div>
        <div className="rounded-lg bg-[#fafbfc] px-3 py-2">
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Supervisor operacional
          </dt>
          <dd className="text-sm font-bold">
            {NewMaintenanceServiceMock.getSignature().supervisor}
          </dd>
        </div>
        <div className="rounded-lg bg-[#fafbfc] px-3 py-2">
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Data / hora
          </dt>
          <dd className="text-sm font-bold tabular-nums">
            {NewMaintenanceServiceMock.getSignature().signedAt}
          </dd>
        </div>
      </dl>
      <div className="mt-3 flex items-center gap-3 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-5">
        <HiFingerPrint className="h-9 w-9 text-neutral-400" />
        <p className="font-serif text-xl italic text-[#0d1f3c]/75">
          {responsible}
        </p>
      </div>
    </section>
  );
}
