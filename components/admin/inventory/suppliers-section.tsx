"use client";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { HiPhone, HiShoppingCart } from "react-icons/hi2";


const STATUS_LABEL = {
  ativo: { label: "Ativo", className: "bg-emerald-50 text-emerald-800 ring-emerald-200/60" },
  atrasado: { label: "Atrasado", className: "bg-red-50 text-red-800 ring-red-200/60" },
  inativo: { label: "Inativo", className: "bg-neutral-100 text-neutral-600 ring-neutral-200/60" },
};

type Props = {
  onOpenSupplier?: (id: string) => void;
  onRequestPurchase?: (supplierName?: string) => void;
  onAction?: (msg: string) => void;
};

export function SuppliersSection({
  onOpenSupplier,
  onRequestPurchase,
  onAction,
}: Props) {
  return (
    <div className="admin-page-stack">
      <div>
        <h2 className="text-lg font-bold text-[#0d1f3c]">Fornecedores</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Parceiros do paddock · prazos e histórico de compras
        </p>
      </div>

      <ul className="admin-page-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {InventoryServiceMock.getStaticSuppliers().map((s) => {
          const st = STATUS_LABEL[s.status];
          return (
            <li
              key={s.id}
              className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[#0d1f3c]">{s.name}</h3>
                <span
                  className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${st.className}`}
                >
                  {st.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                {s.partsSupplied.join(" · ")}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <HiPhone className="h-4 w-4 text-neutral-400" aria-hidden />
                  {s.phone}
                </li>
                <li>
                  <span className="text-neutral-500">WhatsApp: </span>
                  {s.whatsapp}
                </li>
                <li>
                  <span className="text-neutral-500">Prazo médio: </span>
                  <strong>{s.avgLeadDays} dias</strong>
                </li>
                <li>
                  <span className="text-neutral-500">Última compra: </span>
                  <strong>{s.lastPurchase}</strong>
                </li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <button
                  type="button"
                  onClick={() => onOpenSupplier?.(s.id)}
                  className="btn-outline-sm flex-1 bg-white"
                >
                  Abrir fornecedor
                </button>
                <button
                  type="button"
                  onClick={() => onRequestPurchase?.(s.name)}
                  className="btn-primary-sm flex-1"
                >
                  <HiShoppingCart className="h-4 w-4" aria-hidden />
                  Solicitar compra
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAction?.(`Histórico de compras — ${s.name} (mock).`)
                  }
                  className="w-full text-center text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-[#0d1f3c]"
                >
                  Histórico de compras
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
