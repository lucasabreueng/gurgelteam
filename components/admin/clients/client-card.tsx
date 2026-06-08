"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";

import { HiEye, HiPencil } from "react-icons/hi2";
import { UserAvatar } from "@/components/ui/user-avatar";
import {type ClientListItem} from "@/lib/contracts/clients";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import {
  adminBadgeNeutralClass,
  adminCardClass,
  adminCardHoverClass,
  adminTextAccentBoldClass,
  adminTextAccentClass,
} from "@/lib/design";
import {
  ClientCategoriesBadges,
  ClientLevelBadge,
  ClientStatusBadge,
} from "./client-badges";

type Props = {
  client: ClientListItem;
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
  onViewProfile: (id: string) => void;
  onEdit?: (id: string) => void;
};

export function ClientCard({
  client,
  kartCategories,
  skillLevels,
  onViewProfile,
  onEdit}: Props) {
  const categoryLabels = ClientsServiceMock.resolveCategoryNames(client.categoryIds, kartCategories
  );
  const levelName = ClientsServiceMock.resolveLevelName(client.levelId, skillLevels);

  return (
    <article className={`flex flex-col p-5 ${adminCardClass} ${adminCardHoverClass}`}>
      <div className="flex gap-4">
        <UserAvatar
          src={client.avatar}
          name={client.name}
          size={56}
          roundedClass="rounded-2xl"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={adminTextAccentBoldClass}>{client.name}</h3>
            {client.atRisk ? (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase text-red-700 ring-1 ring-red-200/60">
                Risco
              </span>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ClientLevelBadge label={levelName} />
            <ClientStatusBadge status={client.status} />
          </div>
          <div className="mt-2">
            <ClientCategoriesBadges labels={categoryLabels} />
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <dt className="text-neutral-500">Última aula</dt>
          <dd className="font-semibold text-[#111]">{client.lastSession}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Próxima</dt>
          <dd className="font-semibold text-[#111]">{client.nextSession}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Melhor volta</dt>
          <dd className="font-bold tabular-nums text-accent">{client.bestLap}s</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Consistência</dt>
          <dd className="font-bold text-emerald-700">{client.consistency}%</dd>
        </div>
      </dl>

      <p className="mt-3 text-[12px] text-neutral-600">
        <span className={adminTextAccentClass}>{client.activePlan}</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-black/[0.06] pt-4">
        <ActionBtn
          icon={HiEye}
          label="Ver"
          onClick={() => onViewProfile(client.id)}
        />
        <ActionBtn icon={HiPencil} label="Editar" onClick={() => onEdit?.(client.id)} />
      </div>
    </article>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide ${adminBadgeNeutralClass} transition hover:border-accent/25 hover:bg-white`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
  );
}
