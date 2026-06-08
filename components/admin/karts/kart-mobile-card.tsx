"use client";



import Image from "next/image";

import { HiChevronRight } from "react-icons/hi2";

import type { FleetKartListItem } from "@/lib/contracts/karts";

import {

  adminAvatarRingClass,

  adminCardClass,

  adminCardHoverClass,

  adminMetaBadgeClass,

  adminTextAccentBoldClass,

} from "@/lib/design";

import { KartFleetStatusBadge } from "./kart-fleet-status-badge";



type Props = {

  kart: FleetKartListItem;

  onViewDetails: (id: string) => void;

};



export function KartMobileCard({ kart, onViewDetails }: Props) {

  const isClient = kart.ownership === "client";



  return (

    <button

      type="button"

      onClick={() => onViewDetails(kart.id)}

      className={`grid w-full grid-cols-[48px_minmax(0,1fr)_auto] grid-rows-[auto_auto] items-start gap-x-3 gap-y-1.5 px-3 py-3 text-left transition active:scale-[0.99] ${adminCardClass} ${adminCardHoverClass}`}

    >

      <span

        className={`relative row-span-2 h-12 w-12 overflow-hidden rounded-2xl shadow-sm ${adminAvatarRingClass}`}

      >

        <Image src={kart.photo} alt="" fill className="object-cover" sizes="48px" />

      </span>



      <div className="col-start-2 row-start-1 min-w-0">

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

          <span

            className={`inline-flex max-w-full min-w-0 items-center gap-1.5 ${adminMetaBadgeClass} ${adminTextAccentBoldClass}`}

          >

            <span className="shrink-0 text-[11px] font-bold">

              Kart {String(kart.number).padStart(2, "0")}

            </span>

            {isClient && kart.ownerName ? (

              <>

                <span className="shrink-0 text-[var(--ds-text-muted)]" aria-hidden>

                  ·

                </span>

                <span className="min-w-0 truncate text-[11px] font-semibold">

                  {kart.ownerName}

                </span>

              </>

            ) : null}

          </span>

          <KartFleetStatusBadge status={kart.fleetStatus} />

        </div>

      </div>



      <div className="col-start-2 row-start-2 min-w-0">

        <div className="flex flex-wrap items-center gap-1.5">

          <span className={adminMetaBadgeClass}>{kart.categoryName}</span>

          <span className={adminMetaBadgeClass}>{isClient ? "Cliente" : "Próprio"}</span>

        </div>

      </div>



      <div className="col-start-3 row-span-2 flex items-center self-center">

        <HiChevronRight className="h-4 w-4 text-[var(--ds-text-muted)]" aria-hidden />

      </div>

    </button>

  );

}

