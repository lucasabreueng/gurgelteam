import { FinancialServiceMock } from "@/services/finance/financialServiceMock";


type Props = {
  onOpenClient?: (name: string) => void;
};

export function ClientFinancialOverview({ onOpenClient }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <h2 className="text-lg font-bold text-[#0d1f3c]">Financeiro por cliente</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Gasto total, plano e pendências
      </p>
      <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {FinancialServiceMock.getClientFinancials().map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-[rgba(17,17,17,0.06)] p-4 transition hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => onOpenClient?.(c.name)}
              className="w-full text-left"
            >
              <p className="font-bold text-[#0d1f3c]">{c.name}</p>
              <p className="text-xs text-neutral-500">{c.currentPlan}</p>
            </button>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Total gasto</dt>
                <dd className="font-bold text-[#0d1f3c]">{c.totalSpent}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Pagamentos</dt>
                <dd className="font-semibold">{c.paymentsCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Pendências</dt>
                <dd
                  className={`font-bold ${
                    c.pending !== "—" ? "text-amber-700" : "text-neutral-400"
                  }`}
                >
                  {c.pending}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Aulas restantes</dt>
                <dd className="font-semibold">{c.lessonsLeft}</dd>
              </div>
              <div className="flex justify-between border-t border-[rgba(17,17,17,0.06)] pt-2">
                <dt className="text-neutral-500">Ticket médio</dt>
                <dd className="font-bold tabular-nums">{c.ticketAvg}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
