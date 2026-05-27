"use client";

import type { MaintenanceOrderListItem } from "@/lib/contracts/maintenance";

import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";

import Image from "next/image";
import {
  HiClipboardDocumentCheck,
  HiCube,
  HiEye,
  HiFlag,
  HiWrench,
} from "react-icons/hi2";

import { MaintenancePriorityBadge } from "./maintenance-priority-badge";
import { MaintenanceStatusBadge } from "./maintenance-status-badge";

const metaBadge =
  "inline-flex rounded-md border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-2 py-0.5 text-[11px] font-semibold text-[#0d1f3c]";

type Props = {
  order: MaintenanceOrderListItem;
  onViewDetails: (id: string) => void;
};

export function MaintenanceOrderCard({ order, onViewDetails }: Props) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)] transition hover:border-accent/25 hover:shadow-[0_12px_32px_rgba(13,31,60,0.12)]">
      <div className="relative flex h-28 items-stretch bg-[#0d1f3c]">
        <div className="relative h-full w-28 shrink-0">
          <Image
            src={order.kartPhoto}
            alt=""
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                {order.osNumber}
              </p>
              <p className="text-2xl font-bold text-white">
                Kart {String(order.kartNumber).padStart(2, "0")}
              </p>
            </div>
            <MaintenancePriorityBadge priority={order.priority} />
          </div>
          <div className="flex flex-wrap gap-1">
            <span className={metaBadge}>{order.categoryName}</span>
            <span className={metaBadge}>
              {MaintenanceServiceMock.getTypeLabels()[order.type]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3">
          <MaintenanceStatusBadge status={order.status} />
        </div>

        {order.ownerName ? (
          <p className="mb-2 text-sm font-semibold text-[#0d1f3c]">
            {order.ownerName}
          </p>
        ) : null}

        <p className="mb-3 line-clamp-2 text-sm text-neutral-600">
          {order.problem}
        </p>

        <dl className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="font-bold uppercase tracking-wider text-neutral-500">
              Mecânico
            </dt>
            <dd className="mt-0.5 font-semibold text-[#0d1f3c]">
              {order.mechanicName}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-neutral-500">
              Abertura
            </dt>
            <dd className="mt-0.5 font-semibold text-[#0d1f3c]">
              {order.openedAt}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-neutral-500">
              Parado
            </dt>
            <dd className="mt-0.5 font-semibold text-[#0d1f3c]">
              {order.stoppedDays} dia{order.stoppedDays !== 1 ? "s" : ""}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-neutral-500">
              Peças
            </dt>
            <dd className="mt-0.5 font-semibold text-[#0d1f3c]">
              {order.partsNeeded.length} itens
            </dd>
          </div>
        </dl>

        <ul className="mb-4 flex flex-wrap gap-1">
          {order.partsNeeded.slice(0, 3).map((p) => (
            <li
              key={p}
              className="rounded-md bg-[#fafbfc] px-2 py-0.5 text-[10px] font-medium text-neutral-600 ring-1 ring-[rgba(17,17,17,0.06)]"
            >
              {p}
            </li>
          ))}
          {order.partsNeeded.length > 3 ? (
            <li className="text-[10px] text-neutral-500">
              +{order.partsNeeded.length - 3}
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-[rgba(17,17,17,0.06)] pt-3">
          <button
            type="button"
            onClick={() => onViewDetails(order.id)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0d1f3c] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            <HiEye className="h-3.5 w-3.5" aria-hidden />
            Ver detalhes
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-[rgba(17,17,17,0.1)] px-2.5 py-2 text-[#0d1f3c] transition hover:bg-[#fafbfc]"
            aria-label="Alterar status"
          >
            <HiFlag className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-[rgba(17,17,17,0.1)] px-2.5 py-2 text-[#0d1f3c] transition hover:bg-[#fafbfc]"
            aria-label="Checklist"
          >
            <HiClipboardDocumentCheck className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-[rgba(17,17,17,0.1)] px-2.5 py-2 text-[#0d1f3c] transition hover:bg-[#fafbfc]"
            aria-label="Registrar peça"
          >
            <HiCube className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-[rgba(17,17,17,0.1)] px-2.5 py-2 text-[#0d1f3c] transition hover:bg-[#fafbfc]"
            aria-label="Finalizar"
          >
            <HiWrench className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
