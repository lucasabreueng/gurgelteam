"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import { useEffect } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { HiXMark } from "react-icons/hi2";
import { ClassesHistoryTable } from "./classes-history-table";
import { ClientProfileHeader } from "./client-profile-header";
import { FeedbackHistoryTable } from "./feedback-history-table";
import { FinancialSummary } from "./financial-summary";
import { ProfileQuickActionsFooter } from "./profile-quick-actions-footer";
import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
} from "@/components/ui/drawer-footer";
import {
  adminBodyClass,
  adminDrawerHeaderSimpleClass,
  adminDrawerOverlayLightClass,
  adminDrawerPanelFormClass,
  adminDrawerTitleClass,
} from "@/lib/design";

type Props = {
  clientId: string | null;
  onClose: () => void;
  onScheduleClass?: (clientId: string) => void;
  onOpenRegistration?: (clientId: string) => void;
  onGenerateCharge?: (clientId: string) => void;
  onOpenTelemetry?: (clientId: string) => void;
};

export function ClientProfileDrawer({
  clientId,
  onClose,
  onScheduleClass,
  onOpenRegistration,
  onGenerateCharge,
  onOpenTelemetry,
}: Props) {
  const clients = getAppServices().clients;
  const open = Boolean(clientId);

  const { data: client, isPending: clientLoading } = useQuery({
    queryKey: [...queryKeys.clients.list(), "item", clientId] as const,
    queryFn: () => clients.getListItem(clientId!),
    enabled: open,
  });
  const { data: profile, isPending: profileLoading } = useQuery({
    queryKey: [...queryKeys.clients.list(), "profile", clientId] as const,
    queryFn: () => clients.getProfile(clientId!),
    enabled: open && Boolean(client),
  });

  useDrawerBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const loading = clientLoading || profileLoading || !client || !profile;

  return (
    <div className="fixed inset-0 z-[230] flex justify-end">
      <button
        type="button"
        className={adminDrawerOverlayLightClass}
        aria-label="Fechar perfil"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-profile-title"
        className={`${adminDrawerPanelFormClass} lg:max-w-[min(560px,92vw)]`}
      >
        <header className={adminDrawerHeaderSimpleClass}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id="client-profile-title" className={adminDrawerTitleClass}>
                Perfil do piloto
              </h2>
              {client ? (
                <p className={`mt-1 truncate ${adminBodyClass}`}>{client.name}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="space-y-4" aria-busy="true" aria-label="Carregando perfil">
              <div className="h-24 animate-pulse rounded-2xl bg-white/80" />
              <div className="h-32 animate-pulse rounded-2xl bg-white/80" />
              <div className="h-40 animate-pulse rounded-2xl bg-white/80" />
            </div>
          ) : (
            <div className="space-y-6">
              <ClientProfileHeader client={client} />
              <ClassesHistoryTable rows={profile.classesHistory} />
              <FeedbackHistoryTable feedbacks={profile.feedbacks} />
              <FinancialSummary financial={profile.financial} />
            </div>
          )}
        </div>

        {!loading && clientId ? (
          <footer className={DRAWER_FOOTER_SHELL_CLASS}>
            <div className={DRAWER_FOOTER_INNER_CLASS}>
              <ProfileQuickActionsFooter
                onScheduleClass={() => onScheduleClass?.(clientId)}
                onRegisterFeedback={() => onOpenRegistration?.(clientId)}
                onSendResult={() => onOpenTelemetry?.(clientId)}
                onGenerateCharge={() => onGenerateCharge?.(clientId)}
              />
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
