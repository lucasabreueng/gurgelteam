"use client";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { useEffect } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { HiXMark } from "react-icons/hi2";

import { getInventorySupplierById } from "@/lib/inventory-suppliers-store";

const STATUS_STYLE: Record<string, string> = {
  ativo: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  atrasado: "bg-red-50 text-red-800 ring-red-200/60",
  inativo: "bg-neutral-100 text-neutral-600 ring-neutral-200/60",
};

type Props = {
  supplierId: string | null;
  onClose: () => void;
};

export function SupplierDetailsDrawer({ supplierId, onClose }: Props) {
  const supplier = supplierId ? getInventorySupplierById(supplierId) : null;
  useDrawerBodyLock(Boolean(supplierId));


  useEffect(() => {
    if (!supplierId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      };
  }, [supplierId, onClose]);

  if (!supplierId || !supplier) return null;

  const statusClass = STATUS_STYLE[supplier.status] ?? STATUS_STYLE.ativo;

  return (
    <div className="fixed inset-0 z-[228] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="app-drawer-panel relative flex h-full w-full max-w-[min(100vw,720px)] flex-col bg-[var(--ds-bg-panel)] shadow-2xl"
      >
        <header className="shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                {supplier.code}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-[#0d1f3c]">
                  {supplier.name}
                </h2>
                <span
                  className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${statusClass}`}
                >
                  {InventoryServiceMock.getSupplierStatusLabels()[supplier.status]}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)]"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0d1f3c]">Dados cadastrais</h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-neutral-500">CNPJ</dt>
                  <dd>{supplier.cnpj}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Cidade</dt>
                  <dd>{supplier.city}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Telefone</dt>
                  <dd>{supplier.phone}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">WhatsApp</dt>
                  <dd>{supplier.whatsapp}</dd>
                </div>
                {supplier.email ? (
                  <div className="sm:col-span-2">
                    <dt className="text-neutral-500">E-mail</dt>
                    <dd>{supplier.email}</dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0d1f3c]">Operação</h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-neutral-500">Prazo médio</dt>
                  <dd>{supplier.avgLeadDays} dias</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Última compra</dt>
                  <dd>{InventoryServiceMock.formatInventoryDate(supplier.lastPurchase)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-neutral-500">Peças fornecidas</dt>
                  <dd>{supplier.partsSupplied.join(" · ")}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
