"use client";

import Image from "next/image";
import { HiClock, HiEye } from "react-icons/hi2";
import type { FleetKartListItem } from "@/lib/contracts/karts";
import { KartStatusBadge } from "./kart-status-badge";

const metaBadge =
  "inline-flex rounded-md border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-2 py-0.5 text-[11px] font-semibold text-[#0d1f3c]";

type Props = {
  kart: FleetKartListItem;
  onViewDetails: (id: string) => void;
  onViewHistory: (id: string) => void;
};

export function KartPaddockCard({
  kart,
  onViewDetails,
  onViewHistory,
}: Props) {
  const isClient = kart.ownership === "client";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)] transition hover:border-accent/25 hover:shadow-[0_12px_32px_rgba(13,31,60,0.12)]">
      <div className="relative h-36 bg-[#0d1f3c]">
        <Image
          src={kart.photo}
          alt=""
          fill
          className="object-cover opacity-90"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f3c]/90 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="text-3xl font-bold tabular-nums text-white">
            {String(kart.number).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <span className="rounded-lg bg-white/95 px-2 py-1 text-lg font-bold tabular-nums text-[#0d1f3c]">
            {kart.score}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
          <span className={metaBadge}>{kart.categoryName}</span>
          <span className={metaBadge}>
            {isClient ? "Cliente" : "Próprio"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3">
          <KartStatusBadge status={kart.status} />
        </div>
        {isClient && kart.ownerName ? (
          <p className="mb-3 text-sm font-semibold text-[#0d1f3c]">
            {kart.ownerName}
          </p>
        ) : null}

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
          <div>
            <dt className="text-neutral-500">Motor</dt>
            <dd className="font-semibold text-[#111]">{kart.motor}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Chassi</dt>
            <dd className="font-semibold text-[#111]">{kart.chassis}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Último uso</dt>
            <dd className="font-semibold">{kart.lastUse}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Próx. manutenção</dt>
            <dd
              className={`font-semibold ${kart.nextMaintenanceDays < 0 ? "text-red-700" : ""}`}
            >
              {kart.nextMaintenance}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Horas</dt>
            <dd className="font-semibold">{kart.usageHours}h</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-[rgba(17,17,17,0.06)] pt-4">
          <ActionBtn
            icon={HiEye}
            label="Detalhes"
            onClick={() => onViewDetails(kart.id)}
          />
          <ActionBtn
            icon={HiClock}
            label="Histórico"
            onClick={() => onViewHistory(kart.id)}
          />
        </div>
      </div>
    </article>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#0d1f3c] transition hover:bg-white"
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </button>
  );
}
