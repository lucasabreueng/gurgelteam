import { HiPlus, HiShoppingCart } from "react-icons/hi2";
import type { MaintenancePart } from "@/lib/contracts/maintenance";

const partStatusLabel: Record<MaintenancePart["status"], string> = {
  em_estoque: "Em estoque",
  solicitado: "Solicitado",
  aguardando: "Aguardando",
  instalado: "Instalado",
};

export function PartsInventory({ parts }: { parts: MaintenancePart[] }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white"
        >
          <HiPlus className="h-4 w-4" aria-hidden />
          Adicionar peça
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]"
        >
          <HiShoppingCart className="h-4 w-4" aria-hidden />
          Solicitar compra
        </button>
      </div>
      <ul className="space-y-2">
        {parts.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-3"
          >
            <div>
              <p className="font-bold text-[#0d1f3c]">{p.name}</p>
              <p className="text-xs text-neutral-500">
                {p.supplier} · Qtd {p.qty}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-bold text-[#0d1f3c]">{p.cost}</span>
              <span className="rounded-md bg-[#fafbfc] px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ring-[rgba(17,17,17,0.08)]">
                {partStatusLabel[p.status]}
              </span>
              <span className="text-neutral-500">ETA {p.eta}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
