"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";


import { useEffect } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { HiXMark } from "react-icons/hi2";

import { ClassesHistoryTable } from "./classes-history-table";
import { ClientProfileHeader } from "./client-profile-header";
import { FeedbackHistoryTable } from "./feedback-history-table";
import { FinancialSummary } from "./financial-summary";
import { HealthIndicators } from "./health-indicators";
import { PerformanceOverview } from "./performance-overview";
import { ProfileQuickActionsFooter } from "./profile-quick-actions-footer";
import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
} from "@/components/ui/drawer-footer";

type Props = {
  clientId: string | null;
  onClose: () => void;
};

export function ClientProfileDrawer({ clientId, onClose }: Props) {
  const client = clientId ? ClientsServiceMock.getListItem(clientId) : null;
  const profile = clientId ? ClientsServiceMock.getProfile(clientId) : null;
  useDrawerBodyLock(Boolean(clientId));


  useEffect(() => {
    if (!clientId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      };
  }, [clientId, onClose]);

  if (!clientId || !client || !profile) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Fechar perfil"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-profile-title"
        className="app-drawer-panel relative flex h-full w-full max-w-[min(100vw,720px)] flex-col bg-[#f3f5f9] shadow-[-12px_0_48px_rgba(13,31,60,0.2)]"
      >
        <header className="shrink-0 flex items-center justify-between gap-4 border-b border-[rgba(17,17,17,0.08)] bg-white/95 px-5 py-4 backdrop-blur-md">
          <p
            id="client-profile-title"
            className="text-sm font-bold uppercase tracking-wider text-neutral-500"
          >
            Perfil do piloto
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)] text-[#0d1f3c] transition hover:bg-[#fafbfc]"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-6">
          <div className="space-y-8">
            <ClientProfileHeader client={client} />
            <PerformanceOverview performance={profile.performance} />
            <ClassesHistoryTable rows={profile.classesHistory} />
            <FeedbackHistoryTable feedbacks={profile.feedbacks} />
            <FinancialSummary financial={profile.financial} />
            <HealthIndicators flags={profile.health} />
          </div>
        </div>

        <footer className={DRAWER_FOOTER_SHELL_CLASS}>
          <div className={DRAWER_FOOTER_INNER_CLASS}>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Ações rápidas
            </p>
            <ProfileQuickActionsFooter />
          </div>
        </footer>
      </aside>
    </div>
  );
}
