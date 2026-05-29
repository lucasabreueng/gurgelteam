"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";

import Image from "next/image";
import { HiEye, HiPencil } from "react-icons/hi2";
import {type ClientListItem} from "@/lib/contracts/clients";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import {
  ClientCategoriesBadges,
  ClientLevelBadge,
  ClientStatusBadge} from "./client-badges";
import { ClientTablePagination } from "./client-table-pagination";

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
  onEdit}: Props) {
  return (
    <div className="overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
      <div className="overflow-x-auto rounded-t-2xl">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3.5">Piloto</th>
              <th className="px-3 py-3.5">Categoria</th>
              <th className="px-3 py-3.5">Nível</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">Última aula</th>
              <th className="px-3 py-3.5">Próxima</th>
              <th className="px-3 py-3.5">Melhor volta</th>
              <th className="px-3 py-3.5">Consist.</th>
              <th className="px-4 py-3.5 text-right"></th>
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
                  className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
                >
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onViewProfile(client.id)}
                      className="flex items-center gap-3 text-left transition hover:opacity-80"
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-white shadow-sm">
                        <Image
                          src={client.avatar}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </span>
                      <span>
                        <span className="block font-semibold text-[#0d1f3c]">
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
                        label="Ver perfil"
                        onClick={() => onViewProfile(client.id)}
                      />
                      <IconAction
                        icon={HiPencil}
                        label="Editar"
                        onClick={() => onEdit?.(client.id)}
                      />
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
  onClick}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-[#0d1f3c]/5 hover:text-[#0d1f3c]"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
