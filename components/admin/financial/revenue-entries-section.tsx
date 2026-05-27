import { FinancialServiceMock } from "@/services/finance/financialServiceMock";


type Props = {
  onAction?: (msg: string) => void;
};

export function RevenueEntriesSection({ onAction }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <h2 className="text-lg font-bold text-[#0d1f3c]">Entradas</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Receitas por origem · mês atual
      </p>
      <ul className="mt-5 space-y-3">
        {FinancialServiceMock.getRevenueSources().map((src) => (
          <li
            key={src.key}
            className="flex flex-col gap-3 rounded-xl bg-[#fafbfc] p-4 ring-1 ring-[rgba(17,17,17,0.06)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold text-[#0d1f3c]">{src.label}</p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {src.salesCount} vendas
              </p>
            </div>
            <div className="flex items-center gap-4 sm:text-right">
              <div>
                <p className="text-lg font-bold tabular-nums text-[#0d1f3c]">
                  {src.revenue}
                </p>
                <span
                  className={`text-[10px] font-bold ${
                    src.growthPositive ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {src.growth}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAction?.(`Detalhe: ${src.label} (mock).`)}
                className="shrink-0 rounded-lg border border-[rgba(13,31,60,0.12)] px-3 py-2 text-[10px] font-bold uppercase text-[#0d1f3c] hover:bg-white"
              >
                Ver
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
