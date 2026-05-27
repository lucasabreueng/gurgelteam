"use client";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { useMemo, useState } from "react";

import { PartCard } from "./part-card";

type Props = {
  onOpenPart: (id: string) => void;
};

export function PartsGrid({ onOpenPart }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [supplier, setSupplier] = useState("all");
  const [location, setLocation] = useState("all");
  const [compatibility, setCompatibility] = useState("");
  const [criticalOnly, setCriticalOnly] = useState(false);

  const parts = useMemo(
    () =>
      InventoryServiceMock.filterParts({
        query,
        category,
        supplier,
        criticalOnly,
        compatibility,
        location,
      }),
    [query, category, supplier, criticalOnly, compatibility, location]
  );

  return (
    <div className="admin-page-stack">
      <div>
        <h2 className="text-lg font-bold text-[#0d1f3c]">Peças</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Catálogo técnico do paddock · {parts.length} itens
        </p>
      </div>

      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
        <div className="grid gap-3 lg:grid-cols-6">
          <input
            type="search"
            placeholder="Buscar peça, código..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm lg:col-span-2"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm"
          >
            <option value="all">Todas categorias</option>
            {InventoryServiceMock.getCategories().map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm"
          >
            <option value="all">Todos fornecedores</option>
            {InventoryServiceMock.getSupplierNames().map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm"
          >
            <option value="all">Todas localizações</option>
            {InventoryServiceMock.getLocations().map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Compatibilidade"
            value={compatibility}
            onChange={(e) => setCompatibility(e.target.value)}
            className="rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm"
          />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm font-medium text-[#0d1f3c]">
          <input
            type="checkbox"
            checked={criticalOnly}
            onChange={(e) => setCriticalOnly(e.target.checked)}
            className="rounded border-neutral-300"
          />
          Apenas estoque crítico / baixo
        </label>
      </section>

      {parts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500">
          Nenhuma peça encontrada com os filtros atuais.
        </p>
      ) : (
        <ul className="admin-page-grid grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {parts.map((part) => (
            <li key={part.id}>
              <PartCard part={part} onClick={onOpenPart} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
