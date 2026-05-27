import { HiCheckCircle } from "react-icons/hi2";
import type { MaintenanceOrderDetail } from "@/lib/contracts/maintenance";

type ClientFlow = NonNullable<MaintenanceOrderDetail["clientFlow"]>;

export function ClientApprovalFlow({ flow }: { flow: ClientFlow }) {
  return (
    <div>
      <dl className="mb-6 grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Proprietário
          </dt>
          <dd className="mt-1 font-semibold text-[#0d1f3c]">{flow.owner}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Telefone
          </dt>
          <dd className="mt-1 font-semibold text-[#0d1f3c]">{flow.phone}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Autorização
          </dt>
          <dd className="mt-1 font-medium">{flow.authorization}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Orçamento
          </dt>
          <dd className="mt-1 font-bold text-[#0d1f3c]">{flow.budget}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Aprovação
          </dt>
          <dd className="mt-1 font-medium">{flow.approval}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Pendências
          </dt>
          <dd className="mt-1 font-medium text-amber-800">{flow.pendingFinance}</dd>
        </div>
      </dl>

      <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {flow.steps.map((step, i) => (
          <li
            key={step.label}
            className={`flex flex-1 min-w-[140px] items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
              step.done
                ? "border-emerald-200/60 bg-emerald-50 text-emerald-900"
                : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-neutral-500"
            }`}
          >
            {step.done ? (
              <HiCheckCircle className="h-4 w-4 shrink-0" />
            ) : (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] text-neutral-600">
                {i + 1}
              </span>
            )}
            <span className="leading-tight">{step.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
