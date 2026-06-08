"use client";

import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import {
  adminTableActionButtonClass,
  adminTableBodyRowClass,
  adminTableCellClass,
  adminTableHeadRowClass,
  adminTableHeaderLabelClass,
  adminTableScrollClass,
  adminTableWrapClass,
} from "@/lib/design";

export const inventoryTableClass = "w-full min-w-[720px] text-left text-sm";

export const inventoryThClass = `${adminTableHeaderLabelClass} px-3 py-3.5`;

export const inventoryThFirstClass = `${adminTableHeaderLabelClass} px-4 py-3.5`;

export const inventoryTdClass = `${adminTableCellClass} px-3 py-3.5`;

export const inventoryTdFirstClass = `${adminTableCellClass} px-4 py-3.5`;

export const inventoryTdDescClass =
  "px-3 py-3.5 text-sm font-semibold text-[var(--ds-text-primary)]";

export function InventoryTableSelectHeader({
  checked,
  indeterminate,
  onChange,
  label = "Selecionar todos na página",
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <th className="w-10 px-4 py-3.5">
      <input
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = Boolean(indeterminate);
        }}
        onChange={onChange}
        className="h-3.5 w-3.5 rounded border-neutral-300 accent-[#0d1f3c]"
        aria-label={label}
      />
    </th>
  );
}

export function InventoryTableSelectCell({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <td className="px-4 py-3.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 rounded border-neutral-300 accent-[#0d1f3c]"
        aria-label={label}
      />
    </td>
  );
}

export function InventoryTableActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <td className="px-4 py-3.5">
      <div className="flex items-center justify-end gap-1">
        {onView ? (
          <TableIconButton icon={HiEye} label="Visualizar" onClick={onView} />
        ) : null}
        {onEdit ? (
          <TableIconButton icon={HiPencil} label="Editar" onClick={onEdit} />
        ) : null}
        {onDelete ? (
          <TableIconButton icon={HiTrash} label="Excluir" onClick={onDelete} />
        ) : null}
      </div>
    </td>
  );
}

export function TableIconButton({
  icon: Icon,
  label,
  onClick,
}: {
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
      className={adminTableActionButtonClass}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function InventoryTableShell({
  children,
  pagination,
  emptyMessage,
  isEmpty,
}: {
  children: React.ReactNode;
  pagination?: React.ReactNode | null;
  emptyMessage: string;
  isEmpty: boolean;
}) {
  return (
    <div className={adminTableWrapClass}>
      <div className={adminTableScrollClass}>
        <table className={inventoryTableClass}>{children}</table>
      </div>
      {isEmpty ? (
        <p className="px-6 py-12 text-center text-sm text-[var(--ds-text-muted)]">
          {emptyMessage}
        </p>
      ) : pagination ? (
        pagination
      ) : null}
    </div>
  );
}

/** Classes reutilizáveis em `<thead>` / `<tbody>` de tabelas admin. */
export { adminTableHeadRowClass, adminTableBodyRowClass };
