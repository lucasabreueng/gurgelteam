"use client";

import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";

export const inventoryTableClass = "w-full min-w-[720px] text-left text-sm";

export const inventoryThClass =
  "px-3 py-3.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500";

export const inventoryThFirstClass =
  "px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500";

export const inventoryTdClass = "px-3 py-3.5 text-sm text-neutral-700";

export const inventoryTdFirstClass = "px-4 py-3.5 text-sm text-neutral-700";

export const inventoryTdDescClass =
  "px-3 py-3.5 text-sm font-semibold text-[#0d1f3c]";

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
      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-[#0d1f3c]/5 hover:text-[#0d1f3c]"
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
    <div className="overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
      <div className="overflow-x-auto rounded-t-2xl">
        <table className={inventoryTableClass}>{children}</table>
      </div>
      {isEmpty ? (
        <p className="px-6 py-12 text-center text-sm text-neutral-500">
          {emptyMessage}
        </p>
      ) : pagination ? (
        pagination
      ) : null}
    </div>
  );
}
