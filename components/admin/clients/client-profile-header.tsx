"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import type { ClientListItem } from "@/lib/contracts/clients";


import Image from "next/image";


import {
  ClientCategoriesBadges,
  ClientLevelBadge,
  ClientStatusBadge,
} from "./client-badges";

type Props = {
  client: ClientListItem;
};

export function ClientProfileHeader({ client }: Props) {
  const categoryLabels = ClientsServiceMock.resolveCategoryNames(
    client.categoryIds,
    SettingsServiceMock.getKartCategories(),
  );
  const levelName = ClientsServiceMock.resolveLevelName(
    client.levelId,
    SettingsServiceMock.getSkillLevels(),
  );

  return (
    <section className="flex items-center gap-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-[rgba(17,17,17,0.06)]">
        <Image
          src={client.avatar}
          alt=""
          fill
          className="object-cover"
          sizes="64px"
        />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-bold text-[#0d1f3c]">{client.name}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ClientCategoriesBadges labels={categoryLabels} />
          <ClientLevelBadge label={levelName} />
          <ClientStatusBadge status={client.status} />
        </div>
      </div>
    </section>
  );
}
