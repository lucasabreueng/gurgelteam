import Image from "next/image";
import { HiCube } from "react-icons/hi2";
import type { PartCatalogItem } from "@/lib/contracts/parts";
import { PartsServiceMock } from "@/services/parts/partsServiceMock";

type Props = {
  part: PartCatalogItem;
  onSelect: () => void;
};

export function PartAutocompleteCard({ part, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 text-left transition hover:border-accent/30 hover:shadow-md"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#0d1f3c]/5">
        {part.image ? (
          <Image src={part.image} alt="" fill className="object-cover" sizes="48px" />
        ) : (
          <HiCube className="h-6 w-6 text-accent" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-[#0d1f3c]">{part.name}</span>
        <span className="text-[11px] text-neutral-500">
          {part.code} · {part.supplier}
        </span>
        <span className="mt-1 flex flex-wrap gap-2 text-[10px] font-semibold">
          <span className="rounded-md bg-[#fafbfc] px-1.5 py-0.5 ring-1 ring-[rgba(17,17,17,0.08)]">
            Estoque: {part.stock}
          </span>
          <span className="text-neutral-600">{part.location}</span>
        </span>
        <span className="mt-0.5 block text-[10px] text-neutral-500">
          {part.compatibility}
        </span>
      </span>
      <span className="shrink-0 text-sm font-bold text-[#0d1f3c]">
        {PartsServiceMock.formatCurrency(part.unitCost)}
      </span>
    </button>
  );
}
