"use client";

import Image from "next/image";
import {
  HiCheckBadge,
  HiClipboardDocumentCheck,
  HiCube,
  HiPlay,
} from "react-icons/hi2";
import type { MaintenanceOrderDetail } from "@/lib/contracts/maintenance";
import { MaintenancePriorityBadge } from "./maintenance-priority-badge";
import { MaintenanceStatusBadge } from "./maintenance-status-badge";

type Props = {
  detail: MaintenanceOrderDetail;
  hideStatusBadges?: boolean;
};

export function MaintenanceHero({ detail, hideStatusBadges }: Props) {
  const o = detail.order;

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-gradient-to-br from-[#0d1f3c] via-[#132a4d] to-[#0d1f3c] text-white shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 w-full shrink-0 md:h-auto md:w-56">
          <Image
            src={o.kartPhoto}
            alt=""
            fill
            className="object-cover opacity-90"
            sizes="224px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d1f3c]/80 md:bg-gradient-to-t" />
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                {o.osNumber}
              </p>
              <h2 className="text-3xl font-bold tracking-tight">
                Kart {String(o.kartNumber).padStart(2, "0")}
              </h2>
              <p className="mt-1 text-sm text-white/80">{o.categoryName}</p>
            </div>
            {!hideStatusBadges ? (
              <div className="flex flex-col items-end gap-2">
                <MaintenanceStatusBadge status={o.status} />
                <MaintenancePriorityBadge priority={o.priority} />
              </div>
            ) : null}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-[10px] font-bold uppercase text-white/60">
                Responsável
              </dt>
              <dd className="mt-1 font-semibold">{o.mechanicName}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-white/60">
                Tempo parado
              </dt>
              <dd className="mt-1 font-semibold">{o.stoppedDays} dias</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-white/60">
                Previsão
              </dt>
              <dd className="mt-1 font-semibold">{detail.eta}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-white/60">
                Disponibilidade
              </dt>
              <dd className="mt-1 font-semibold">
                {o.status === "liberado" ? "Liberado" : "Indisponível"}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-white/90"
            >
              <HiPlay className="h-4 w-4" aria-hidden />
              Iniciar serviço
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition hover:bg-white/10"
            >
              <HiCube className="h-4 w-4" aria-hidden />
              Registrar peça
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition hover:bg-white/10"
            >
              <HiClipboardDocumentCheck className="h-4 w-4" aria-hidden />
              Abrir checklist
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/20 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition hover:bg-emerald-500/30"
            >
              <HiCheckBadge className="h-4 w-4" aria-hidden />
              Liberar para pista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
