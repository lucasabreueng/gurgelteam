"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { SettingsTabKey } from "@/lib/contracts/settings";
import { AdminShell } from "../admin-shell";
import { SettingsHeader } from "./settings-header";
import { SettingsSidebar } from "./settings-sidebar";
import { SettingsTabContent } from "./settings-tab-content";

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

export function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("geral");
  const [dirty, setDirty] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) {
        router.push(href);
        return;
      }
    },
    [router]
  );

  const handleSave = () => {
    setDirty(false);
    setContentKey((k) => k + 1);
  };

  const handleDiscard = () => {
    setDirty(false);
    setContentKey((k) => k + 1);
  };

  return (
    <AdminShell
      activeNav="configuracoes"
      onNav={onNav}
      mobileTitle="Configurações"
      pageHeader={
        <SettingsHeader
          dirty={dirty}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      }
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
        <aside className="lg:w-[240px] lg:shrink-0">
          <SettingsSidebar active={activeTab} onChange={setActiveTab} />
        </aside>
        <div className="min-w-0 flex-1">
          <SettingsTabContent
            key={contentKey}
            activeTab={activeTab}
            onDirty={() => setDirty(true)}
          />
        </div>
      </div>
    </AdminShell>
  );
}
