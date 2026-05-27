"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";

import { useEffect, useRef, useState } from "react";
import { HiChevronRight } from "react-icons/hi2";
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

  return (
    <button
      type="button"
      onClick={() => onViewProfile(client.id)}
      className="flex w-full items-center gap-2 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-3 py-2.5 text-left shadow-[0_1px_8px_rgba(13,31,60,0.04)] transition active:scale-[0.99] hover:border-accent/20"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate text-[13px] font-bold text-[#0d1f3c]">
            {client.name}
          </span>
          {client.atRisk ? (
            <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[8px] font-bold uppercase text-red-700 ring-1 ring-red-200/60">
              Risco
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <ClientLevelBadge label={levelName} />
          <ClientStatusBadge status={client.status} />
          <ClientCategoriesBadges labels={categoryLabels} />
        </div>
        <p className="mt-1 text-[11px] text-neutral-600">
          <span className="font-bold tabular-nums text-accent">{client.bestLap}s</span>
          <span className="mx-1.5 text-neutral-300">·</span>
          <span>{client.consistency}% consist.</span>
        </p>
      </div>
      <HiChevronRight
        className="h-4 w-4 shrink-0 text-neutral-400"
        aria-hidden
      />
    </button>
  );
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
