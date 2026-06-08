"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";

import { UserAvatar } from "@/components/ui/user-avatar";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import {
  adminTableActionButtonClass,
  adminTextAccentClass,
} from "@/lib/design";
import {type ClientListItem} from "@/lib/contracts/clients";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import {
  ClientCategoriesBadges,
  ClientLevelBadge,
  ClientStatusBadge} from "./client-badges";
import { ClientTablePagination } from "./client-table-pagination";
import {
  clientsTableBodyRowHoverClass,
  clientsTableScrollClass,
  clientsTableHeadRowClass,
  clientsTableWrapClass,
} from "./clients-table-shared";

type Props = {
  clients: ClientListItem[];
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewProfile: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ClientTable({
  clients,
  kartCategories,
  skillLevels,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onViewProfile,
  onEdit,
  onDelete}: Props) {
  return (
    <div className={clientsTableWrapClass}>
      <div className={clientsTableScrollClass}>
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className={clientsTableHeadRowClass}>
              <th className="px-4 py-3.5">Piloto</th>
              <th className="px-3 py-3.5">Categoria</th>
              <th className="px-3 py-3.5">Nível</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">Última aula</th>
              <th className="px-3 py-3.5">Próxima</th>
              <th className="px-3 py-3.5">Melhor volta</th>
              <th className="px-3 py-3.5">Consist.</th>
              <th className="px-4 py-3.5 text-right" aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const categoryLabels = ClientsServiceMock.resolveCategoryNames(client.categoryIds, kartCategories
              );
              const levelName = ClientsServiceMock.resolveLevelName(client.levelId, skillLevels);

              return (
                <tr
                  key={client.id}
                  className={clientsTableBodyRowHoverClass}
                >
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onViewProfile(client.id)}
                      className="flex items-center gap-3 text-left transition hover:opacity-80"
                    >
                      <UserAvatar src={client.avatar} name={client.name} size={40} />
                      <span>
                        <span className={`block ${adminTextAccentClass}`}>
                          {client.name}
                        </span>
                        {client.atRisk ? (
                          <span className="text-[10px] font-bold uppercase text-red-600">
                            Em risco
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-3.5">
                    <ClientCategoriesBadges labels={categoryLabels} />
                  </td>
                  <td className="px-3 py-3.5">
                    <ClientLevelBadge label={levelName} />
                  </td>
                  <td className="px-3 py-3.5">
                    <ClientStatusBadge status={client.status} />
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">
                    {client.lastSession}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">
                    {client.nextSession}
                  </td>
                  <td className="px-3 py-3.5 font-bold tabular-nums text-accent">
                    {client.bestLap}s
                  </td>
                  <td className="px-3 py-3.5 font-semibold text-emerald-700">
                    {client.consistency}%
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <IconAction
                        icon={HiEye}
                        label={`Ver perfil de ${client.name}`}
                        onClick={() => onViewProfile(client.id)}
                      />
                      {onEdit ? (
                        <IconAction
                          icon={HiPencil}
                          label={`Editar ${client.name}`}
                          onClick={() => onEdit(client.id)}
                        />
                      ) : null}
                      {onDelete ? (
                        <IconAction
                          icon={HiTrash}
                          label={`Excluir ${client.name}`}
                          onClick={() => onDelete(client.id)}
                          variant="danger"
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {clients.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-neutral-500">
          Nenhum cliente encontrado com os filtros atuais.
        </p>
      ) : (
        <ClientTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

function IconAction({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`${adminTableActionButtonClass} ${
        variant === "danger"
          ? "text-red-600 hover:border-red-200 hover:bg-red-50"
          : ""
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
