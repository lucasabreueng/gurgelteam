"use client";

import { InspectionServiceMock } from "@/services/maintenance/inspectionServiceMock";

import type { InspectionTypeKey, InspectionTypeOption } from "@/lib/contracts/maintenance";

import {
  HiArrowRightOnRectangle,
  HiBolt,
  HiClock,
  HiEye,
  HiFlag,
  HiShieldCheck,
  HiTrophy,
  HiWrench,
} from "react-icons/hi2";
import type { IconType } from "react-icons/lib";


const ICONS: Record<InspectionTypeOption["icon"], IconType> = {
  flag: HiFlag,
  clock: HiClock,
  wrench: HiWrench,
  shield: HiShieldCheck,
  trophy: HiTrophy,
  bolt: HiBolt,
  eye: HiEye,
  login: HiArrowRightOnRectangle,
};

type Props = {
  selected: InspectionTypeKey;
  onSelect: (key: InspectionTypeKey) => void;
};

export function InspectionTypeSelector({ selected, onSelect }: Props) {
  return (
    <section>
      <h2 className="text-sm font-bold text-[#0d1f3c]">Tipo de inspeção</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Selecione o protocolo técnico da sessão
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {InspectionServiceMock.getTypeOptions().map((opt) => {
          const Icon = ICONS[opt.icon];
          const active = selected === opt.key;
          return (
            <li key={opt.key}>
              <button
                type="button"
                onClick={() => onSelect(opt.key)}
                className={`group flex h-full w-full flex-col rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                  active
                    ? "border-accent bg-gradient-to-br from-[#0d1f3c] to-[#1a3a5c] text-white shadow-[0_8px_24px_rgba(13,31,60,0.25)]"
                    : "border-[rgba(17,17,17,0.08)] bg-white hover:border-accent/30 hover:shadow-md"
                }`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-[#fafbfc] text-[#0d1f3c] group-hover:bg-accent/10 group-hover:text-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-3 text-sm font-bold">{opt.label}</span>
                <span
                  className={`mt-1 text-xs leading-relaxed ${
                    active ? "text-white/75" : "text-neutral-500"
                  }`}
                >
                  {opt.description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
