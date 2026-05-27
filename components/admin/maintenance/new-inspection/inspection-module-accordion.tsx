"use client";

import { InspectionServiceMock } from "@/services/maintenance/inspectionServiceMock";

import type { InspectionItemState } from "@/lib/contracts/maintenance";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

import { InspectionItemRow } from "./inspection-item";

type Props = {
  items: Record<string, InspectionItemState>;
  onItemChange: (id: string, patch: Partial<InspectionItemState>) => void;
};

export function InspectionModuleAccordion({ items, onItemChange }: Props) {
  const [openIds, setOpenIds] = useState<string[]>(["motor", "freios"]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section>
      <h2 className="text-sm font-bold text-[#0d1f3c]">Módulos da inspeção</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Avalie cada sistema do kart
      </p>
      <ul className="mt-4 space-y-3">
        {InspectionServiceMock.getModules().map((mod) => {
          const open = openIds.includes(mod.id);
          const modItems = mod.items.map((i) => items[i.id]);
          const done = modItems.filter((s) => s?.status).length;
          const fails = modItems.filter((s) => s?.status === "fail").length;

          return (
            <li
              key={mod.id}
              className="overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(mod.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-[#fafbfc] md:px-5"
              >
                <div>
                  <span className="text-sm font-bold text-[#0d1f3c]">
                    {mod.title}
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    {done}/{mod.items.length} avaliados
                    {fails > 0 ? (
                      <span className="ml-2 font-bold text-red-600">
                        · {fails} reprovado(s)
                      </span>
                    ) : null}
                  </span>
                </div>
                <HiChevronDown
                  className={`h-5 w-5 shrink-0 text-neutral-400 transition ${
                    open ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
              {open ? (
                <div className="space-y-3 border-t border-[rgba(17,17,17,0.06)] bg-[#fafbfc]/50 px-4 py-4 md:px-5">
                  {mod.items.map((item) => (
                    <InspectionItemRow
                      key={item.id}
                      item={item}
                      state={
                        items[item.id] ?? {
                          status: null,
                          severity: null,
                          note: "",
                        }
                      }
                      onChange={(patch) => onItemChange(item.id, patch)}
                    />
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
