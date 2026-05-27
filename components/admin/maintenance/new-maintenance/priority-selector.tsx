"use client";

import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";

import type { NewMaintenancePriority } from "@/lib/contracts/maintenance";



type Props = {
  selected: NewMaintenancePriority;
  onSelect: (key: NewMaintenancePriority) => void;
};

export function PrioritySelector({ selected, onSelect }: Props) {
  return (
    <section>
      <h2 className="text-sm font-bold text-[#0d1f3c]">Prioridade</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {NewMaintenanceServiceMock.getPriorityOptions().map((opt) => {
          const active = selected === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSelect(opt.key)}
              className={`rounded-xl border-2 px-3 py-3 text-center transition ${
                active
                  ? `border-transparent text-white shadow-md ring-2 ring-offset-2 ${opt.color} ${opt.ring}`
                  : "border-[rgba(17,17,17,0.08)] bg-white hover:bg-[#fafbfc]"
              }`}
            >
              <span
                className={`block text-xs font-bold uppercase tracking-wide ${
                  active ? "text-white" : "text-[#0d1f3c]"
                }`}
              >
                {opt.label}
              </span>
              {active ? (
                <span
                  className={`mx-auto mt-2 block h-1.5 w-8 rounded-full ${opt.color}`}
                />
              ) : (
                <span
                  className={`mx-auto mt-2 block h-1.5 w-8 rounded-full opacity-40 ${opt.color}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
