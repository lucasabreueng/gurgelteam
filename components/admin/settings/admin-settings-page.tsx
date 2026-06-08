"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { SettingsTabKey } from "@/lib/contracts/settings";
import { AdminShell } from "../admin-shell";
import { SettingsHeader } from "./settings-header";
import { SettingsSidebar } from "./settings-sidebar";
import {
  SettingsTabContent,
  type SettingsTabContentHandle,
} from "./settings-tab-content";
import { AdminTabPanelSkeleton } from "../admin-page-skeletons";

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
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isTabPending, startTabTransition] = useTransition();
  const contentRef = useRef<SettingsTabContentHandle>(null);

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

  const handleSave = async () => {
    setSaving(true);
    setSaveFeedback(null);
    try {
      await contentRef.current?.save();
      setDirty(false);
      setSaveFeedback({
        type: "success",
        message: "Alterações salvas com sucesso.",
      });
      if (activeTab !== "horarios") {
        setContentKey((k) => k + 1);
      }
    } catch (error) {
      console.error("[settings save]", error);
      setSaveFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível salvar. Tente novamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setDirty(false);
    setContentKey((k) => k + 1);
  };

  const handleTabChange = (tab: SettingsTabKey) => {
    startTabTransition(() => setActiveTab(tab));
    setSaveFeedback(null);
  };

  return (
    <AdminShell
      activeNav="configuracoes"
      onNav={onNav}
      mobileTitle="Configurações"
      pageHeader={
        <SettingsHeader
          dirty={dirty}
          saving={saving}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      }
    >
      <div className="admin-settings-layout admin-page-stack lg:flex-row lg:items-start">
        <aside className="min-w-0 lg:w-[240px] lg:shrink-0">
          <SettingsSidebar active={activeTab} onChange={handleTabChange} />
        </aside>
        <div className="min-w-0 flex-1">
          {saveFeedback ? (
            <p
              role={saveFeedback.type === "error" ? "alert" : "status"}
              className={`mb-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                saveFeedback.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900"
              }`}
            >
              {saveFeedback.message}
            </p>
          ) : null}
          {isTabPending ? (
            <AdminTabPanelSkeleton />
          ) : (
            <SettingsTabContent
              ref={contentRef}
              key={contentKey}
              activeTab={activeTab}
              onDirty={() => setDirty(true)}
              onSaved={() => setDirty(false)}
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}
