"use client";

function formatBrl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Props = {
  partsTotal: number;
  labor: number;
  external: number;
  total: number;
  isClientKart: boolean;
  onGenerateQuote?: () => void;
  onSendApproval?: () => void;
  onChargeClient?: () => void;
};

export function EstimatedCostsCard({
  partsTotal,
  labor,
  external,
  total,
  isClientKart,
  onGenerateQuote,
  onSendApproval,
  onChargeClient,
}: Props) {
  const rows = [
    { label: "Peças", value: partsTotal },
    { label: "Mão de obra", value: labor },
    { label: "Serviços externos", value: external },
  ];

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-gradient-to-br from-[#0d1f3c] to-[#152a47] p-5 text-white shadow-md">
      <h2 className="text-sm font-bold uppercase tracking-wider text-white/60">
        Custos estimados
      </h2>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.label} className="flex justify-between text-sm">
            <span className="text-white/70">{r.label}</span>
            <span className="font-bold tabular-nums">{formatBrl(r.value)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-end justify-between border-t border-white/15 pt-4">
        <span className="text-xs font-bold uppercase text-white/50">
          Total estimado
        </span>
        <span className="text-2xl font-black tabular-nums">{formatBrl(total)}</span>
      </div>
      {isClientKart ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onGenerateQuote}
            className="rounded-lg bg-white/15 px-3 py-2 text-[10px] font-bold uppercase hover:bg-white/25"
          >
            Gerar orçamento
          </button>
          <button
            type="button"
            onClick={onSendApproval}
            className="rounded-lg bg-white/15 px-3 py-2 text-[10px] font-bold uppercase hover:bg-white/25"
          >
            Enviar aprovação
          </button>
          <button
            type="button"
            onClick={onChargeClient}
            className="rounded-lg bg-accent px-3 py-2 text-[10px] font-bold uppercase text-white"
          >
            Cobrar cliente
          </button>
        </div>
      ) : null}
    </section>
  );
}
