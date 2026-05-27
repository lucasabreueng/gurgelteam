"use client";

import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";

import type { PredictedPartLine } from "@/lib/contracts/maintenance";

import { PartsServiceMock } from "@/services/parts/partsServiceMock";

import { useMemo, useState } from "react";
import { HiMagnifyingGlass, HiPlus, HiTrash } from "react-icons/hi2";


import { settingsInputClass } from "../../settings/settings-section";

type Props = {
  lines: PredictedPartLine[];
  onChange: (lines: PredictedPartLine[]) => void;
  onRequestPurchase?: () => void;
};

function formatBrl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PredictedPartsSection({
  lines,
  onChange,
  onRequestPurchase,
}: Props) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => NewMaintenanceServiceMock.searchParts(query), [query]);

  const addPart = (partId: string) => {
    const exists = lines.find((l) => l.partId === partId);
    if (exists) {
      onChange(
        lines.map((l) =>
          l.partId === partId ? { ...l, quantity: l.quantity + 1 } : l
        )
      );
    } else {
      onChange([...lines, { partId, quantity: 1 }]);
    }
    setQuery("");
  };

  const updateQty = (partId: string, qty: number) => {
    if (qty < 1) {
      onChange(lines.filter((l) => l.partId !== partId));
      return;
    }
    onChange(
      lines.map((l) => (l.partId === partId ? { ...l, quantity: qty } : l))
    );
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Peças previstas</h2>
      <div className="relative mt-3">
        <HiMagnifyingGlass
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar corrente, pinhão, pneus…"
          className={`${settingsInputClass} w-full pl-10`}
        />
      </div>
      {query.trim() ? (
        <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-xl bg-[#fafbfc] p-2">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => addPart(p.id)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-white"
              >
                <span className="font-semibold text-[#0d1f3c]">{p.name}</span>
                <HiPlus className="h-4 w-4 text-accent" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="mt-4 space-y-3">
        {lines.map((line) => {
          const part = PartsServiceMock.getCatalog().find((p) => p.id === line.partId);
          if (!part) return null;
          const low = part.stockLevel !== "ok";
          const total = part.unitCost * line.quantity;
          return (
            <li
              key={line.partId}
              className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#0d1f3c]">
                    {part.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Estoque: {part.stock} · {formatBrl(part.unitCost)}/un
                  </p>
                  {low ? (
                    <p className="mt-1 text-[10px] font-bold uppercase text-amber-700">
                      Estoque baixo
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange(lines.filter((l) => l.partId !== line.partId))
                  }
                  className="text-red-500"
                  aria-label="Remover"
                >
                  <HiTrash className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(line.partId, line.quantity - 1)}
                    className="h-8 w-8 rounded-lg bg-white font-bold ring-1"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold tabular-nums">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(line.partId, line.quantity + 1)}
                    className="h-8 w-8 rounded-lg bg-white font-bold ring-1"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-bold tabular-nums text-[#0d1f3c]">
                  {formatBrl(total)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {lines.length === 0 ? (
        <p className="mt-3 text-center text-xs text-neutral-500">
          Nenhuma peça adicionada
        </p>
      ) : null}
      <button
        type="button"
        onClick={onRequestPurchase}
        className="mt-4 w-full rounded-xl border-2 border-dashed border-amber-300/80 py-2.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 hover:bg-amber-50"
      >
        Solicitar compra
      </button>
    </section>
  );
}
