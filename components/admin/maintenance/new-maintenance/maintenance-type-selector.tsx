"use client";

import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";

import type { NewMaintenanceTypeKey } from "@/lib/contracts/maintenance";

import {
  HiBolt,
  HiCog6Tooth,
  HiFire,
  HiFlag,
  HiShieldCheck,
  HiTrophy,
  HiWrench,
} from "react-icons/hi2";
import type { IconType } from "react-icons/lib";


type MaintenanceTypeIcon = ReturnType<
  typeof NewMaintenanceServiceMock.getTypeOptions
>[number]["icon"];

const ICONS: Record<MaintenanceTypeIcon, IconType> = {
  shield: HiShieldCheck,
  wrench: HiWrench,
  fire: HiFire,
  cog: HiCog6Tooth,
  bolt: HiBolt,
  flag: HiFlag,
  trophy: HiTrophy,
};

type Props = {
  selected: NewMaintenanceTypeKey;
  onSelect: (key: NewMaintenanceTypeKey) => void;
};

export function MaintenanceTypeSelector({ selected, onSelect }: Props) {
  return (
    <section>
      <h2 className="text-sm font-bold text-[#0d1f3c]">Tipo de manutenção</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {NewMaintenanceServiceMock.getTypeOptions().map((opt) => {
          const Icon = ICONS[opt.icon];
          const active = selected === opt.key;
          return (
            <li key={opt.key}>
              <button
                type="button"
                onClick={() => onSelect(opt.key)}
                className={`flex h-full w-full gap-3 rounded-xl border-2 p-3 text-left transition ${
                  active
                    ? "border-[#0d1f3c] bg-[#0d1f3c] text-white shadow-md"
                    : "border-[rgba(17,17,17,0.08)] bg-white hover:border-accent/30"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    active ? "bg-white/15" : "bg-[#fafbfc] text-[#0d1f3c]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{opt.label}</span>
                  <span
                    className={`mt-0.5 block text-xs ${
                      active ? "text-white/70" : "text-neutral-500"
                    }`}
                  >
                    {opt.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
