"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import type { ClientListItem, ClientProfileDetail } from "@/lib/contracts/clients";


import Image from "next/image";


import {
  adminHeroOverlayClass,
  adminHeroSectionClass,
} from "@/lib/design";
import {
  ClientCategoriesBadges,
  ClientLevelBadge,
  ClientStatusBadge,
} from "./client-badges";

type Props = {
  client: ClientListItem;
  profile: ClientProfileDetail;
};

export function ClientHero({ client, profile }: Props) {
  const categoryLabels = ClientsServiceMock.resolveCategoryNames(
    client.categoryIds,
    SettingsServiceMock.getKartCategories()
  );
  const levelName = ClientsServiceMock.resolveLevelName(
    client.levelId,
    SettingsServiceMock.getSkillLevels(),
  );
  return (
    <section className={adminHeroSectionClass}>
      <div className="absolute inset-0">
        <Image
          src={profile.heroBg}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 720px"
          priority
        />
        <div className={adminHeroOverlayClass} />
        <div className="absolute inset-0 bg-[url('/images/tracado.svg')] bg-cover bg-center opacity-[0.06]" />
      </div>

      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:p-8">
        <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-4 ring-white/20 shadow-2xl md:h-28 md:w-28">
          <Image
            src={client.avatar}
            alt=""
            fill
            className="object-cover"
            sizes="112px"
          />
        </span>
        <div className="min-w-0 flex-1 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {client.name}
            </h2>
            <ClientLevelBadge label={levelName} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <ClientCategoriesBadges labels={categoryLabels} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ClientStatusBadge status={client.status} />
            <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/90 ring-1 ring-white/15">
              #{profile.internalRanking} ranking interno
            </span>
          </div>
        </div>
        <dl className="grid shrink-0 gap-3 sm:grid-cols-2 md:grid-cols-1 md:text-right lg:grid-cols-2 lg:text-left">
          <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm">
            <dt className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Objetivo
            </dt>
            <dd className="mt-1 text-sm font-semibold">{profile.goal}</dd>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm">
            <dt className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Tempo no Gurgel
            </dt>
            <dd className="mt-1 text-sm font-semibold">{profile.timeAtGurgel}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
