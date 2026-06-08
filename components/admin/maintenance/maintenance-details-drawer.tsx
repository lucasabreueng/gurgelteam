"use client";

import { useMaintenanceOrderDetail } from "@/lib/query/hooks/use-maintenance-order-detail";

import { useEffect } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { HiXMark } from "react-icons/hi2";

import { MaintenanceHero } from "./maintenance-hero";
import { MaintenanceMediaGallery } from "./maintenance-media-gallery";
import { MaintenancePriorityBadge } from "./maintenance-priority-badge";
import { MaintenanceStatusBadge } from "./maintenance-status-badge";
import { MaintenanceStatusFlow } from "./maintenance-status-flow";
import { MaintenanceTimeline } from "./maintenance-timeline";
import { PartsInventory } from "./parts-inventory";
import { TechnicalChecklistAccordion } from "./technical-checklist-accordion";

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#0d1f3c]">{title}</h3>
      {desc ? <p className="mt-1 text-sm text-neutral-600">{desc}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

type Props = {
  orderId: string | null;
  onClose: () => void;
};

export function MaintenanceDetailsDrawer({ orderId, onClose }: Props) {
  const { data: detail, isLoading } = useMaintenanceOrderDetail(orderId);
  const open = Boolean(orderId);
  useDrawerBodyLock(open);

  useEffect(() => {
    if (!orderId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [orderId, onClose]);

  if (!orderId) return null;

  if (isLoading || !detail) {
    return (
      <div className="fixed inset-0 z-[100] flex justify-end">
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          aria-label="Fechar"
          onClick={onClose}
        />
        <aside className="app-drawer-panel relative flex h-full w-full max-w-3xl flex-col bg-[var(--ds-bg-panel)] p-8 shadow-2xl">
          <div className="h-full animate-pulse rounded-2xl bg-white" />
        </aside>
      </div>
    );
  }

  const report = detail.problemReport;
  const order = detail.order;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside className="app-drawer-panel relative flex h-full w-full max-w-3xl flex-col bg-[var(--ds-bg-panel)] shadow-2xl">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-5 py-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <p className="text-lg font-bold text-[#0d1f3c]">{order.osNumber}</p>
            <MaintenanceStatusBadge status={order.status} />
            <MaintenancePriorityBadge priority={order.priority} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-600 transition hover:bg-[#fafbfc]"
            aria-label="Fechar detalhes"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <div className="space-y-6">
            <MaintenanceHero detail={detail} hideStatusBadges />

            <MaintenanceStatusFlow
              currentStatus={order.status}
              orientation="vertical"
            />

            <Section title="Descrição do problema">
              <p className="text-sm leading-relaxed text-neutral-700">
                {report.text}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-bold uppercase text-neutral-500">
                    Identificado por
                  </dt>
                  <dd className="mt-1 font-semibold">{report.identifiedBy}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase text-neutral-500">
                    Data / hora
                  </dt>
                  <dd className="mt-1 font-semibold">{report.dateTime}</dd>
                </div>
              </dl>
              {report.media.length > 0 ? (
                <MaintenanceMediaGallery items={report.media} />
              ) : null}
              {report.technicalNotes ? (
                <p className="mt-4 rounded-xl bg-[#fafbfc] p-4 text-sm italic text-neutral-700 ring-1 ring-[rgba(17,17,17,0.06)]">
                  {report.technicalNotes}
                </p>
              ) : null}
            </Section>

            {detail.checklist.length > 0 ? (
              <Section title="Checklist técnico">
                <TechnicalChecklistAccordion groups={detail.checklist} />
              </Section>
            ) : null}

            {detail.parts.length > 0 ? (
              <Section title="Peças e estoque">
                <PartsInventory parts={detail.parts} />
              </Section>
            ) : null}

            {detail.history.length > 0 ? (
              <Section title="Histórico técnico">
                <MaintenanceTimeline items={detail.history} />
              </Section>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
