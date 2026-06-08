"use client";

import Image from "next/image";

import type { PilotBookingSlotsApiDTO } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { resolveClientAvatarUrl } from "@/lib/client-avatar";

type EligiblePilot = PilotBookingSlotsApiDTO["slots"][number]["eligiblePilots"][number];

type Props = {
  pilots: readonly EligiblePilot[];
  selectedIds: ReadonlySet<string>;
  onToggle: (clientId: string) => void;
};

export function PilotBookingPilotPicker({
  pilots,
  selectedIds,
  onToggle,
}: Props) {
  return (
    <div className="w-full max-w-lg space-y-2">
      <p className="text-center text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
        Pilotos elegíveis neste horário
      </p>
      <ul className="space-y-2">
        {pilots.map((pilot) => {
          const selected = selectedIds.has(pilot.clientId);
          return (
            <li key={pilot.clientId}>
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => onToggle(pilot.clientId)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-accent/40 bg-accent/[0.04] ring-1 ring-accent/20"
                    : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc] hover:border-accent/25 hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold ${
                    selected
                      ? "border-accent bg-accent text-white"
                      : "border-neutral-300 bg-white text-transparent"
                  }`}
                  aria-hidden
                >
                  ✓
                </span>
                <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={resolveClientAvatarUrl(pilot.avatarUrl)}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-[#0d1f3c]">
                    {pilot.fullName}
                  </span>
                  <span className="block truncate text-[11px] text-neutral-500">
                    {pilot.categoryName} · {pilot.levelName}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {selectedIds.size > 1 ? (
        <p className="text-center text-[11px] font-medium text-accent">
          Reserva em grupo — {selectedIds.size} pilotos selecionados
        </p>
      ) : null}
    </div>
  );
}
