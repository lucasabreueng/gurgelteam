"use client";

import { useEffect, useRef } from "react";
import { useKartDetail } from "@/lib/query/hooks/use-karts";
import { useKartTechnicalTimeline } from "@/lib/query/hooks/use-kart-technical-timeline";
import { KartTechnicalTimeline } from "./kart-technical-timeline";
import {
  ScheduleDrawerShell,
} from "@/components/admin/schedule/schedule-drawer-shell";
import {
  adminDrawerPanelWideClass,
  adminDrawerSectionCardClass,
  adminMetaBadgeClass,
  adminSubsectionTitleClass,
} from "@/lib/design";
import { KartFleetStatusBadge } from "./kart-fleet-status-badge";

const FINANCIAL_LABELS: Record<
  | "revenue"
  | "maintenanceCost"
  | "parts"
  | "profit"
  | "pending"
  | "margin",
  string
> = {
  revenue: "Receita",
  maintenanceCost: "Custo de manutenção",
  parts: "Peças",
  profit: "Lucro",
  pending: "Pendências",
  margin: "Margem",
};

const CLIENT_INFO_LABELS: Record<
  | "phone"
  | "whatsapp"
  | "box"
  | "authorizedServices"
  | "pending"
  | "contact"
  | "internalNotes"
  | "entryDate"
  | "pickupEstimate",
  string
> = {
  phone: "Telefone",
  whatsapp: "WhatsApp",
  box: "Box",
  authorizedServices: "Serviços autorizados",
  pending: "Pendências",
  contact: "Contato",
  internalNotes: "Observações internas",
  entryDate: "Data de entrada",
  pickupEstimate: "Previsão de retirada",
};

type Props = {
  kartId: string | null;
  focusHistory?: boolean;
  onClose: () => void;
  onEdit?: (kartId: string) => void;
};

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
    <section className={adminDrawerSectionCardClass}>
      <h3 className={adminSubsectionTitleClass}>{title}</h3>
      {desc ? <p className="mt-1 text-sm text-[var(--ds-text-secondary)]">{desc}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function KartDetailDrawer({
  kartId,
  focusHistory = false,
  onClose,
  onEdit,
}: Props) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { data: detail, isPending: detailLoading } = useKartDetail(kartId);
  const { data: technicalTimeline = [], isPending: timelineLoading } =
    useKartTechnicalTimeline(kartId);

  useEffect(() => {
    if (!kartId || !focusHistory || !timelineRef.current) return;
    const timer = window.setTimeout(() => {
      timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [kartId, focusHistory, technicalTimeline.length]);

  if (!kartId || detailLoading || !detail) return null;

  const k = detail.list;
  const isClient = k.ownership === "client";

  const checkClass = (s: string) =>
    s === "ok"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200/60"
      : s === "warn"
        ? "bg-amber-50 text-amber-900 ring-amber-200/60"
        : "bg-red-50 text-red-800 ring-red-200/60";

  const financialItems = (
    Object.entries(detail.financial) as [
      keyof typeof FINANCIAL_LABELS,
      string,
    ][]
  ).map(([key, value]) => ({
    label: FINANCIAL_LABELS[key],
    value,
  }));

  const telemetryMetrics = [
    { label: "Velocidade máxima", value: detail.telemetry.maxSpeedKmh },
    { label: "RPM mín.", value: detail.telemetry.minRpm },
    { label: "RPM máx.", value: detail.telemetry.maxRpm },
    { label: "Tempo médio", value: detail.telemetry.avgLap },
    { label: "Melhor tempo", value: detail.telemetry.bestLap },
  ];

  return (
    <ScheduleDrawerShell
      open={Boolean(kartId)}
      onClose={onClose}
      title={`Kart ${String(k.number).padStart(2, "0")}`}
      titleId="kart-detail-drawer-title"
      description={
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{k.categoryName}</span>
          <span aria-hidden>·</span>
          <span>{isClient ? "Cliente" : "Próprio"}</span>
          <KartFleetStatusBadge status={k.fleetStatus} />
        </span>
      }
      headerActions={
        onEdit ? (
          <button
            type="button"
            onClick={() => onEdit(kartId)}
            className="btn-outline-sm bg-white"
          >
            Editar
          </button>
        ) : null
      }
      panelClassName={adminDrawerPanelWideClass}
      zIndexClass="z-[200]"
    >
      <div className="space-y-6 px-4 py-5 md:px-6">
        <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tabular-nums text-[#0d1f3c]">
                Kart {String(k.number).padStart(2, "0")}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={adminMetaBadgeClass}>{k.categoryName}</span>
                <span className={adminMetaBadgeClass}>
                  {isClient ? "Cliente" : "Próprio"}
                </span>
                <KartFleetStatusBadge status={k.fleetStatus} />
              </div>
              {isClient && k.ownerName ? (
                <p className="mt-2 text-sm font-semibold text-[#0d1f3c]">
                  {k.ownerName}
                </p>
              ) : null}
            </div>
            <div className="rounded-xl bg-[#fafbfc] px-4 py-3 text-center ring-1 ring-[rgba(17,17,17,0.06)]">
              <p className="text-[10px] font-bold uppercase text-neutral-500">
                Confiabilidade
              </p>
              <p className="mt-1 text-2xl font-bold text-[#0d1f3c]">
                {detail.reliabilityScore}
              </p>
            </div>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <dt className="text-neutral-500">Motor</dt>
              <dd className="font-semibold text-[#0d1f3c]">{k.motor}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Chassi</dt>
              <dd className="font-semibold text-[#0d1f3c]">{k.chassis}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Horas de motor</dt>
              <dd className="font-semibold text-[#0d1f3c]">{k.usageHours}h</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Último uso</dt>
              <dd className="font-semibold text-[#0d1f3c]">{k.lastUse}</dd>
            </div>
          </dl>
        </section>

        <Section title="Histórico de uso" desc="Aulas, treinos e eventos.">
          <ol
            id="kart-usage-history"
            className="space-y-3 border-l-2 border-[rgba(13,31,60,0.12)] pl-5"
          >
            {detail.usageHistory.map((e) => (
              <li key={e.id}>
                <p className="text-[11px] font-bold uppercase text-neutral-500">
                  {e.date}
                </p>
                <p className="font-semibold text-[#0d1f3c]">
                  {e.title} — {e.pilot}
                  {e.duration ? ` — ${e.duration}` : ""}
                </p>
                {e.note ? (
                  <p className="text-sm text-neutral-600">{e.note}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Manutenção">
          <div className="grid gap-6 lg:grid-cols-2">
            {(["preventiva", "corretiva"] as const).map((kind) => (
              <div key={kind}>
                <p className="mb-2 text-[11px] font-bold uppercase text-neutral-500">
                  {kind === "preventiva" ? "Preventiva" : "Corretiva"}
                </p>
                <ul className="space-y-2">
                  {detail.maintenance
                    .filter((m) => m.kind === kind)
                    .map((m) => (
                      <li
                        key={m.id}
                        className="rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc] px-3 py-2 text-sm"
                      >
                        <p className="font-semibold text-[#0d1f3c]">{m.area}</p>
                        <p className="text-[12px] text-neutral-600">
                          {m.lastDone} → {m.nextDue} · {m.cost}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Motor">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Horas</dt>
              <dd className="font-semibold">{detail.engine.hours}h</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Última revisão</dt>
              <dd className="font-semibold">{detail.engine.lastRevision}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Preparação</dt>
              <dd className="font-semibold">{detail.engine.prep}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Desempenho</dt>
              <dd className="font-semibold">{detail.engine.performance}</dd>
            </div>
          </dl>
        </Section>

        <Section title="Checklist operacional">
          <ul className="grid gap-2 sm:grid-cols-2">
            {detail.checklist.map((c) => (
              <li
                key={c.item}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold ring-1 ${checkClass(c.status)}`}
              >
                {c.item}
                <span className="text-[10px] uppercase">
                  {c.status === "ok"
                    ? "Aprovado"
                    : c.status === "warn"
                      ? "Atenção"
                      : "Reprovar"}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Financeiro" desc="Resumo financeiro do kart.">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {financialItems.map((item) => (
              <li
                key={item.label}
                className="rounded-xl bg-[#fafbfc] px-4 py-3 ring-1 ring-[rgba(17,17,17,0.06)]"
              >
                <p className="text-[10px] font-bold uppercase text-neutral-500">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-bold text-[#0d1f3c]">
                  {item.value}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {detail.clientInfo ? (
          <Section title="Kart de cliente">
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              {(
                Object.entries(detail.clientInfo) as [
                  keyof typeof CLIENT_INFO_LABELS,
                  string | string[],
                ][]
              ).map(([key, val]) => (
                <div key={key}>
                  <dt className="text-[10px] font-bold uppercase text-neutral-500">
                    {CLIENT_INFO_LABELS[key]}
                  </dt>
                  <dd className="mt-1 font-medium">
                    {Array.isArray(val) ? val.join(", ") : String(val)}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        ) : null}

        <Section
          title="Telemetria e performance"
          desc={`Consolidado das últimas ${detail.telemetry.sessionsCount} sessões.`}
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {telemetryMetrics.map((metric) => (
              <li
                key={metric.label}
                className="rounded-xl bg-[#fafbfc] px-4 py-3 ring-1 ring-[rgba(17,17,17,0.06)]"
              >
                <p className="text-[10px] font-bold uppercase text-neutral-500">
                  {metric.label}
                </p>
                <p className="mt-1 text-lg font-bold text-[#0d1f3c]">
                  {metric.value}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Histórico técnico"
          desc="Inspeções, manutenções e checklists completos em ordem cronológica."
        >
          <div id="kart-technical-timeline" ref={timelineRef}>
            {timelineLoading ? (
              <p className="text-sm text-neutral-500">Carregando histórico…</p>
            ) : (
              <KartTechnicalTimeline entries={technicalTimeline} />
            )}
          </div>
        </Section>
      </div>
    </ScheduleDrawerShell>
  );
}
