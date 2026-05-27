"use client";

import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";

import type { PlannedServiceKey } from "@/lib/contracts/maintenance";



type Props = {
  selected: PlannedServiceKey[];
  onChange: (keys: PlannedServiceKey[]) => void;
};

export function PlannedServicesSection({ selected, onChange }: Props) {
  const toggle = (key: PlannedServiceKey) => {
    onChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key]
    );
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Serviços previstos</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {NewMaintenanceServiceMock.getPlannedServices().map((svc) => {
          const active = selected.includes(svc.key);
          return (
            <li key={svc.key}>
              <button
                type="button"
                onClick={() => toggle(svc.key)}
                className={`w-full rounded-xl border-2 px-3 py-3 text-left text-sm font-bold transition ${
                  active
                    ? "border-accent bg-accent/10 text-[#0d1f3c]"
                    : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-neutral-600 hover:border-accent/25"
                }`}
              >
                {svc.label}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
