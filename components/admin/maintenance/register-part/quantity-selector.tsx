"use client";

import type { PartUnit } from "@/lib/contracts/parts";

import { PartsServiceMock } from "@/services/parts/partsServiceMock";

import { HiMinus, HiPlus } from "react-icons/hi2";

import { SettingsDropdown } from "../../settings/settings-dropdown";

type Props = {
  quantity: number;
  unit: PartUnit;
  stockBefore: number;
  onQuantityChange: (qty: number) => void;
  onUnitChange: (unit: PartUnit) => void;
};

export function QuantitySelector({
  quantity,
  unit,
  stockBefore,
  onQuantityChange,
  onUnitChange,
}: Props) {
  const stockAfter = Math.max(0, stockBefore - quantity);

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Quantidade utilizada</h3>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(13,31,60,0.2)] bg-[#fafbfc] text-[#0d1f3c] transition hover:bg-white"
            aria-label="Diminuir"
          >
            <HiMinus className="h-5 w-5" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              onQuantityChange(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            className="h-12 w-20 rounded-xl border border-[rgba(13,31,60,0.2)] bg-white text-center text-2xl font-bold tabular-nums text-[#0d1f3c] outline-none focus:border-accent"
            aria-label="Quantidade"
          />
          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(13,31,60,0.2)] bg-[#fafbfc] text-[#0d1f3c] transition hover:bg-white"
            aria-label="Aumentar"
          >
            <HiPlus className="h-5 w-5" />
          </button>
        </div>
        <div className="min-w-[140px] flex-1">
          <SettingsDropdown
            aria-label="Unidade"
            value={unit}
            options={PartsServiceMock.getPartUnitOptions().map((u) => ({
              value: u.value,
              label: u.label,
            }))}
            onSelect={(v) => onUnitChange(v as PartUnit)}
          />
        </div>
      </div>
      <div className="mt-4 flex gap-4 rounded-xl bg-[#fafbfc] px-4 py-3 text-sm ring-1 ring-[rgba(17,17,17,0.06)]">
        <p>
          <span className="text-neutral-500">Estoque atual: </span>
          <strong className="tabular-nums">{stockBefore}</strong>
        </p>
        <p>
          <span className="text-neutral-500">Após registro: </span>
          <strong
            className={`tabular-nums ${
              stockAfter === 0 ? "text-red-600" : "text-[#0d1f3c]"
            }`}
          >
            {stockAfter}
          </strong>
        </p>
      </div>
    </section>
  );
}
