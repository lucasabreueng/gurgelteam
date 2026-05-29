"use client";

import Image from "next/image";
import { HiChevronRight } from "react-icons/hi2";
import type { FleetKartListItem } from "@/lib/contracts/karts";
import { KartStatusBadge } from "./kart-status-badge";

type Props = {
  kart: FleetKartListItem;
  onViewDetails: (id: string) => void;
};

const metaBadge =
  "rounded-md bg-[#fafbfc] px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 ring-1 ring-[rgba(17,17,17,0.06)]";

export function KartMobileCard({ kart, onViewDetails }: Props) {
  const isClient = kart.ownership === "client";

  return (
    <button
      type="button"
      onClick={() => onViewDetails(kart.id)}
      className="grid w-full grid-cols-[48px_minmax(0,1fr)_auto] grid-rows-[auto_auto] items-start gap-x-3 gap-y-1.5 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-3 py-3 text-left shadow-[0_1px_8px_rgba(13,31,60,0.04)] transition active:scale-[0.99] hover:border-accent/20"
    >
      <span className="relative row-span-2 h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-white shadow-sm">
        <Image src={kart.photo} alt="" fill className="object-cover" sizes="48px" />
      </span>

      <div className="col-start-2 row-start-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`inline-flex max-w-full min-w-0 items-center gap-1.5 ${metaBadge} text-[#0d1f3c]`}
          >
            <span className="shrink-0 text-[11px] font-bold">
              Kart {String(kart.number).padStart(2, "0")}
            </span>
            {isClient && kart.ownerName ? (
              <>
                <span className="shrink-0 text-neutral-400" aria-hidden>
                  ·
                </span>
                <span className="min-w-0 truncate text-[11px] font-semibold">
                  {kart.ownerName}
                </span>
              </>
            ) : null}
          </span>
          <KartStatusBadge status={kart.status} />
        </div>
      </div>

      <div className="col-start-2 row-start-2 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={metaBadge}>{kart.categoryName}</span>
          <span className={metaBadge}>{isClient ? "Cliente" : "Próprio"}</span>
        </div>
      </div>

      <div className="col-start-3 row-span-2 flex items-center self-center">
        <HiChevronRight className="h-4 w-4 text-neutral-300" aria-hidden />
      </div>
    </button>
  );
}
