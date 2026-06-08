"use client";

import type { KartStatus } from "@/lib/contracts/karts";

import { useKartsFleet } from "@/lib/query/hooks/use-karts";
import { useKartsPaddock } from "@/lib/query/hooks/use-karts-paddock";
import { KartsServiceMock } from "@/services/karts/kartsServiceMock";

import { statusStyle } from "./kart-status-badge";

export function PaddockGarageView() {
  const { data: fleet = [] } = useKartsFleet();
  const { data: paddock, isLoading } = useKartsPaddock();
  const boxes = paddock?.boxes ?? [];

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-5 md:p-6">
      <h3 className="text-lg font-bold text-[#0d1f3c]">Vista de garagem</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Boxes do paddock em tempo real.
      </p>
      {isLoading ? (
        <p className="mt-5 text-sm text-neutral-500">Carregando paddock…</p>
      ) : null}
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {boxes.map((box) => {
          const kart = box.kartId
            ? fleet.find((k) => k.id === box.kartId)
            : null;
          const status = box.status === "empty" ? null : box.status;
          return (
            <li
              key={box.slot}
              className={`rounded-xl border-2 p-4 transition ${
                kart
                  ? "border-[rgba(13,31,60,0.12)] bg-white shadow-sm"
                  : "border-dashed border-[rgba(17,17,17,0.12)] bg-white/50"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                {box.slot}
              </p>
              {kart ? (
                <>
                  <p className="mt-2 text-2xl font-bold text-[#0d1f3c]">
                    {String(kart.number).padStart(2, "0")}
                  </p>
                  {status ? (
                    <span
                      className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ring-1 ${statusStyle(status as KartStatus)}`}
                    >
                      {KartsServiceMock.getStatusLabels()[status as KartStatus]}
                    </span>
                  ) : null}
                </>
              ) : (
                <p className="mt-4 text-sm text-neutral-400">Vazio</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
