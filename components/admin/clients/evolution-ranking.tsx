"use client";

import { useState } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useClientsRankings } from "@/lib/query/hooks/use-clients-rankings";
import {
  adminListRowClass,
  adminRankBadgeClass,
  adminSegmentControlWrapClass,
  adminSegmentTabClass,
  adminSubsectionTitleClass,
  adminTextAccentClass,
} from "@/lib/design";


const TABS = [
  { key: "evolution" as const, label: "Mais evoluíram" },
  { key: "training" as const, label: "Mais treinaram" },
  { key: "laps" as const, label: "Melhores tempos" },
  { key: "consistency" as const, label: "Maior consistência" },
];

export function EvolutionRanking() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("evolution");
  const { data: rankings, isLoading } = useClientsRankings();
  const entries = rankings?.[tab] ?? [];

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className={adminSubsectionTitleClass}>
            Ranking de evolução
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Destaques do mês na base de pilotos.
          </p>
        </div>
        <div className={adminSegmentControlWrapClass}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={adminSegmentTabClass(tab === t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="mt-5 text-sm text-neutral-500">Carregando ranking…</p>
      ) : entries.length === 0 ? (
        <p className="mt-5 text-sm text-neutral-500">
          Sem dados de ranking no momento.
        </p>
      ) : null}

      <ol className="mt-5 space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={adminListRowClass}
          >
            <span className={adminRankBadgeClass}>
              {entry.rank}
            </span>
            <UserAvatar
              src={entry.avatar}
              name={entry.name}
              size={40}
              roundedClass="rounded-full"
            />
            <div className="min-w-0 flex-1">
              <p className={adminTextAccentClass}>{entry.name}</p>
              <p className="text-[11px] text-neutral-500">{entry.metric}</p>
            </div>
            <p className="font-bold tabular-nums text-accent">{entry.value}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
