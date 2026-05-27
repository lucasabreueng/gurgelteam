"use client";

import type { PermissionKey, RolePermissions } from "@/lib/contracts/settings";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";
import { SettingsToggle } from "./settings-toggle";

type Props = {
  title: string;
  description: string;
  permissions: RolePermissions;
  onChange: (key: PermissionKey, value: boolean) => void;
  readOnly?: boolean;
};

export function PermissionCard({
  title,
  description,
  permissions,
  onChange,
  readOnly,
}: Props) {
  return (
    <article className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-5 md:p-6">
      <h3 className="text-base font-bold text-[#0d1f3c]">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
      <ul className="mt-5 divide-y divide-[rgba(17,17,17,0.06)] rounded-xl border border-[rgba(17,17,17,0.06)] bg-white px-4">
        {(Object.keys(SettingsServiceMock.getPermissionLabels()) as PermissionKey[]).map((key) => (
          <li key={key} className="py-1">
            <SettingsToggle
              label={SettingsServiceMock.getPermissionLabels()[key]}
              checked={permissions[key]}
              onChange={(v) => onChange(key, v)}
              disabled={readOnly}
            />
          </li>
        ))}
      </ul>
    </article>
  );
}
