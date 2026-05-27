"use client";

import Image from "next/image";
import { HiCube } from "react-icons/hi2";
import type { InventoryPart } from "@/lib/contracts/inventory";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import { StockStatusBadge } from "./stock-status-badge";

type Props = {
  part: InventoryPart;
  onClick: (id: string) => void;
};

export function PartCard({ part, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(part.id)}
      className="flex w-full flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white text-left shadow-[0_2px_12px_rgba(13,31,60,0.04)] transition hover:border-[#0d1f3c]/15 hover:shadow-[0_6px_24px_rgba(13,31,60,0.08)]"
    >
      <div className="relative flex h-32 items-center justify-center bg-[#fafbfc]">
        {part.image ? (
          <Image
            src={part.image}
            alt=""
            fill
            className="object-cover"
            sizes="280px"
          />
        ) : (
          <HiCube className="h-10 w-10 text-neutral-300" aria-hidden />
        )}
        <div className="absolute left-3 top-3">
          <StockStatusBadge level={part.stockLevel} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          {part.code}
        </p>
        <h4 className="mt-1 font-bold text-[#0d1f3c]">{part.name}</h4>
        <p className="mt-1 text-xs text-neutral-500">{part.category}</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <div>
            <dt className="text-neutral-500">Estoque</dt>
            <dd className="font-semibold text-[#0d1f3c]">
              {part.stock} / mín. {part.minStock}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Custo</dt>
            <dd className="font-semibold text-[#0d1f3c]">
              {InventoryServiceMock.formatCurrency(part.unitCost)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-neutral-500">Localização</dt>
            <dd className="font-medium">{part.location}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-neutral-500">Compatibilidade</dt>
            <dd className="font-medium">{part.compatibility}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-neutral-500">Fornecedor</dt>
            <dd className="font-medium">{part.supplierName}</dd>
          </div>
        </dl>
      </div>
    </button>
  );
}
