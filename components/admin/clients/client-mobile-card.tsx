"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiCalendarDays, HiChevronRight } from "react-icons/hi2";
import {type ClientListItem} from "@/lib/contracts/clients";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import {
  ClientCategoriesBadges,
  ClientLevelBadge,
  ClientStatusBadge} from "./client-badges";

const MOBILE_BATCH_SIZE = 12;

type Props = {
  client: ClientListItem;
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
  onViewProfile: (id: string) => void;
};

/** Card compacto para listagem mobile de clientes. */
export function ClientMobileCard({
  client,
  kartCategories,
  skillLevels,
  onViewProfile}: Props) {
  const categoryLabels = ClientsServiceMock.resolveCategoryNames(client.categoryIds, kartCategories
  );
  const levelName = ClientsServiceMock.resolveLevelName(client.levelId, skillLevels);

  const nextSessionLabel = formatNextSessionLabel(client.nextSession);

  return (
    <button
      type="button"
      onClick={() => onViewProfile(client.id)}
      className="grid w-full grid-cols-[48px_minmax(0,1fr)_auto] grid-rows-[auto_auto_auto] items-start gap-x-3 gap-y-1.5 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-3 py-3 text-left shadow-[0_1px_8px_rgba(13,31,60,0.04)] transition active:scale-[0.99] hover:border-accent/20"
    >
      <span className="relative row-span-3 h-full min-h-[72px] w-12 overflow-hidden rounded-2xl ring-2 ring-white shadow-sm">
        <Image
          src={client.avatar}
          alt=""
          fill
          className="object-cover"
          sizes="48px"
        />
      </span>

      <div className="col-start-2 row-start-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate text-[13px] font-bold text-[#0d1f3c]">
            {client.name}
          </span>
          <ClientStatusBadge status={client.status} />
          {client.atRisk ? (
            <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[8px] font-bold uppercase text-red-700 ring-1 ring-red-200/60">
              Risco
            </span>
          ) : null}
        </div>
      </div>

      <div className="col-start-2 row-start-2 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <ClientLevelBadge label={levelName} />
          <ClientCategoriesBadges labels={categoryLabels} />
        </div>
      </div>

      <div className="col-start-2 row-start-3 min-w-0 text-[11px] text-neutral-600">
        <span className="inline-flex items-center gap-1">
          <HiCalendarDays className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
          <span className="font-semibold text-[#111]">{nextSessionLabel}</span>
        </span>
      </div>

      <div className="col-start-3 row-span-3 flex items-center self-center">
        <HiChevronRight className="h-4 w-4 text-neutral-300" aria-hidden />
      </div>
    </button>
  );
}

function formatNextSessionLabel(nextSession: unknown): string {
  const raw = String(nextSession ?? "").trim();
  if (!raw) return "Sem próxima sessão";

  const parsed = tryParseLooseDateTime(raw);
  if (!parsed) return raw;

  const dd = String(parsed.getDate()).padStart(2, "0");
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const yyyy = String(parsed.getFullYear());
  const hh = String(parsed.getHours()).padStart(2, "0");
  const min = String(parsed.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function tryParseLooseDateTime(raw: string): Date | null {
  // ISO (ex.: 2026-05-27T14:30:00Z ou sem Z)
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // yyyy-mm-dd [HH:mm]
  const ymd = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?/
  );
  if (ymd) {
    const [, y, m, d, hh = "00", min = "00"] = ymd;
    const dt = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(min));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  // dd/mm/yyyy [HH:mm]
  const dmy = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/
  );
  if (dmy) {
    const [, d, m, y, hh = "00", min = "00"] = dmy;
    const dt = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(min));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  // fallback (pode funcionar em alguns formatos, mas não confio 100%)
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

type ListProps = {
  clients: ClientListItem[];
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
  onViewProfile: (id: string) => void;
};

export function ClientMobileList({
  clients,
  kartCategories,
  skillLevels,
  onViewProfile}: ListProps) {
  const [visibleCount, setVisibleCount] = useState(MOBILE_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(MOBILE_BATCH_SIZE);
  }, [clients]);

  const visibleClients = clients.slice(0, visibleCount);
  const hasMore = visibleCount < clients.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + MOBILE_BATCH_SIZE, clients.length)
          );
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [clients.length, hasMore]);

  return (
    <div className="lg:hidden">
      {clients.length === 0 ? (
        <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
          Nenhum cliente encontrado com os filtros atuais.
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {visibleClients.map((client) => (
              <li key={client.id}>
                <ClientMobileCard
                  client={client}
                  kartCategories={kartCategories}
                  skillLevels={skillLevels}
                  onViewProfile={onViewProfile}
                />
              </li>
            ))}
          </ul>
          {hasMore ? (
            <div
              ref={sentinelRef}
              className="py-4 text-center text-[11px] font-medium text-neutral-500"
              aria-hidden
            >
              Carregando mais…
            </div>
          ) : visibleClients.length > MOBILE_BATCH_SIZE ? (
            <p className="py-4 text-center text-[11px] font-medium text-neutral-400">
              {clients.length} cliente{clients.length === 1 ? "" : "s"} exibidos
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
