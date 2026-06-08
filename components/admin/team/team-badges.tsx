"use client";

import type { RoleKey } from "@/lib/contracts/enums";
import {
  adminBadgeNeutralClass,
  adminBadgeNeutralStatusClass,
  adminBadgeSuccessClass,
  adminTextAccentClass,
} from "@/lib/design";

export function TeamRoleBadge({ label }: { label: string }) {
  return <span className={adminBadgeNeutralClass}>{label}</span>;
}

export function TeamStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${
        active ? adminBadgeSuccessClass : adminBadgeNeutralStatusClass
      }`}
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

export function teamRoleAccentClass(roleKey: RoleKey): string {
  void roleKey;
  return adminTextAccentClass;
}
