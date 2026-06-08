"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import type { ClientListItem } from "@/lib/contracts/clients";
import { adminCardClass, adminAvatarRingClass, adminSubsectionTitleClass } from "@/lib/design";


import { UserAvatar } from "@/components/ui/user-avatar";

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
    <section className={`flex items-center gap-4 p-4 shadow-sm ${adminCardClass}`}>
      <UserAvatar
        src={client.avatar}
        name={client.name}
        size={64}
        roundedClass={`rounded-xl ${adminAvatarRingClass}`}
      />
      <div className="min-w-0 flex-1">
        <h2 className={adminSubsectionTitleClass}>{client.name}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ClientCategoriesBadges labels={categoryLabels} />
          <ClientLevelBadge label={levelName} />
          <ClientStatusBadge status={client.status} />
        </div>
      </div>
    </section>
  );
}
