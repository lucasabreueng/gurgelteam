import type { FinalResultStatus } from "@/lib/contracts/maintenance";

const STATUS_STYLES: Record<
  FinalResultStatus,
  { label: string; pill: string; border: string }
> = {
  liberado: {
    label: "Liberado",
    pill: "bg-emerald-500 text-white",
    border: "border-emerald-200/60",
  },
  restrito: {
    label: "Restrito",
    pill: "bg-amber-500 text-white",
    border: "border-amber-200/60",
  },
  bloqueado: {
    label: "Bloqueado",
    pill: "bg-red-500 text-white",
    border: "border-red-200/60",
  },
};

type Props = {
  status: FinalResultStatus;
  ok: number;
  warn: number;
  fail: number;
  critical: number;
};

export function FinalInspectionResult({
  status,
  ok,
  warn,
  fail,
  critical,
}: Props) {
  const s = STATUS_STYLES[status];

  return (
    <section
      className={`rounded-2xl border-2 bg-white p-5 shadow-sm md:p-6 ${s.border}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Resultado final
          </p>
          <span
            className={`mt-2 inline-block rounded-xl px-5 py-2 text-sm font-bold uppercase tracking-wider ${s.pill}`}
          >
            {s.label}
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "OK", value: ok, color: "text-emerald-700" },
            { label: "Atenção", value: warn, color: "text-amber-700" },
            { label: "Reprovados", value: fail, color: "text-red-700" },
            { label: "Críticos", value: critical, color: "text-red-900" },
          ].map((cell) => (
            <li
              key={cell.label}
              className="rounded-xl bg-[#fafbfc] px-4 py-3 text-center ring-1 ring-[rgba(17,17,17,0.06)]"
            >
              <p className="text-[10px] font-bold uppercase text-neutral-500">
                {cell.label}
              </p>
              <p className={`mt-1 text-2xl font-black tabular-nums ${cell.color}`}>
                {cell.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
