"use client";

import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { TeamMemberListItem } from "@/lib/contracts/team";
import { canRemoveTeamMember } from "@/lib/team/team-rules";
import {
  adminTableActionButtonClass,
  adminTableDangerActionButtonClass,
  adminTableCellClass,
  adminTextAccentClass,
} from "@/lib/design";
import { ClientTablePagination } from "../clients/client-table-pagination";
import {
  clientsTableBodyRowHoverClass,
  clientsTableHeadRowClass,
  clientsTableScrollClass,
  clientsTableWrapClass,
} from "../clients/clients-table-shared";
import { TeamRoleBadge, TeamStatusBadge } from "./team-badges";

type Props = {
  members: TeamMemberListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
};

export function TeamTable({
  members,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onRemove,
}: Props) {
  return (
    <div className={clientsTableWrapClass}>
      <div className={clientsTableScrollClass}>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className={clientsTableHeadRowClass}>
              <th className="px-4 py-3.5">Membro</th>
              <th className="px-3 py-3.5">E-mail</th>
              <th className="px-3 py-3.5">Usuário</th>
              <th className="px-3 py-3.5">Função</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">Cadastro</th>
              <th className="px-4 py-3.5 text-right" aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const removable = canRemoveTeamMember(member);
              return (
                <tr key={member.id} className={clientsTableBodyRowHoverClass}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={member.avatar}
                        name={member.name}
                        size={40}
                      />
                      <span className={`font-semibold ${adminTextAccentClass}`}>
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className={`px-3 py-3.5 ${adminTableCellClass}`}>
                    {member.email}
                  </td>
                  <td className={`px-3 py-3.5 ${adminTableCellClass}`}>
                    {member.username}
                  </td>
                  <td className="px-3 py-3.5">
                    <TeamRoleBadge label={member.roleLabel} />
                  </td>
                  <td className="px-3 py-3.5">
                    <TeamStatusBadge active={member.active} />
                  </td>
                  <td className={`px-3 py-3.5 ${adminTableCellClass}`}>
                    {member.createdAtLabel}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <IconAction
                        icon={HiEye}
                        label={`Ver perfil de ${member.name}`}
                        onClick={() => onView(member.id)}
                      />
                      {removable && onEdit ? (
                        <IconAction
                          icon={HiPencil}
                          label={`Editar ${member.name}`}
                          onClick={() => onEdit(member.id)}
                        />
                      ) : null}
                      {onRemove ? (
                        <IconAction
                          icon={HiTrash}
                          label={`Remover ${member.name}`}
                          onClick={removable ? () => onRemove(member.id) : undefined}
                          variant="danger"
                          disabled={!removable}
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
      <ClientTablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

function IconAction({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={
        variant === "danger"
          ? adminTableDangerActionButtonClass
          : adminTableActionButtonClass
      }
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
