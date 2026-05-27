import Image from "next/image";
import { HiCube } from "react-icons/hi2";
import type { PartCatalogItem } from "@/lib/contracts/parts";
import { PartsServiceMock } from "@/services/parts/partsServiceMock";

export function SelectedPartCard({ part }: { part: PartCatalogItem }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-white to-[#fafbfc] shadow-[0_4px_20px_rgba(13,31,60,0.08)]">
      <div className="flex gap-4 p-4">
        <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0d1f3c]">
          {part.image ? (
            <Image src={part.image} alt="" fill className="object-cover opacity-90" sizes="64px" />
          ) : (
            <HiCube className="h-8 w-8 text-white/80" aria-hidden />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Peça selecionada
          </p>
          <h3 className="text-lg font-bold text-[#0d1f3c]">{part.name}</h3>
          <p className="text-sm text-neutral-600">{part.code}</p>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-2 border-t border-[rgba(17,17,17,0.06)] bg-white/80 px-4 py-3 text-xs sm:grid-cols-3">
        <div>
          <dt className="font-bold uppercase text-neutral-500">Fornecedor</dt>
          <dd className="font-semibold text-[#0d1f3c]">{part.supplier}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase text-neutral-500">Categoria</dt>
          <dd className="font-semibold">{part.category}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase text-neutral-500">Estoque</dt>
          <dd className="font-bold tabular-nums text-[#0d1f3c]">{part.stock}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase text-neutral-500">Custo unit.</dt>
          <dd className="font-bold text-accent">{PartsServiceMock.formatCurrency(part.unitCost)}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase text-neutral-500">Local</dt>
          <dd>{part.location}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="font-bold uppercase text-neutral-500">Compat.</dt>
          <dd>{part.compatibility}</dd>
        </div>
      </dl>
    </div>
  );
}
