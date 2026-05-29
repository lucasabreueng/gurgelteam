"use client";

import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { KartsServiceMock } from "@/services/karts/kartsServiceMock";
import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";
import { KartTechnicalTimeline } from "./kart-technical-timeline";
import {
  ScheduleDrawerShell,
} from "@/components/admin/schedule/schedule-drawer-shell";
import { KartStatusBadge } from "./kart-status-badge";

const KART_DETAIL_PANEL_CLASS =
  "app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl lg:w-[min(100%,800px)] lg:max-w-[800px] lg:shrink-0";

const metaBadge =
  "inline-flex rounded-md border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-2 py-0.5 text-[11px] font-semibold text-[#0d1f3c]";

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
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#0d1f3c]">{title}</h3>
      {desc ? <p className="mt-1 text-sm text-neutral-600">{desc}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const DETAIL_TAB_CLASS =
  "relative shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors";

export function KartDetailDrawer({
  kartId,
  focusHistory = false,
  onClose,
  onEdit,
}: Props) {
  const [detailTab, setDetailTab] = useState<"overview" | "technical">("overview");
  const detail = kartId ? KartsServiceMock.getDetail(kartId) : null;
  const technicalTimeline = kartId
    ? MaintenanceServiceMock.getKartTechnicalTimeline(kartId)
    : [];

  useEffect(() => {
    if (!kartId) return;
    setDetailTab(focusHistory ? "technical" : "overview");
  }, [kartId, focusHistory]);

  useEffect(() => {
    if (!kartId || !focusHistory) return;
    const timer = window.setTimeout(() => {
      document
        .getElementById("kart-technical-timeline")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [kartId, focusHistory, detailTab]);

  const chartOption: EChartsOption = useMemo(() => {
    if (!detail) return {};
    return {
      grid: { left: 48, right: 16, top: 24, bottom: 32 },
      xAxis: {
        type: "category",
        data: detail.telemetry.lapTrend.map((point) => point.date),
        axisLine: { lineStyle: { color: "rgba(17,17,17,0.12)" } },
        axisLabel: { color: "#737373", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        scale: true,
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#737373",
          fontSize: 11,
          formatter: (value: number) => `${value.toFixed(1)}s`,
        },
      },
      series: [
        {
          type: "line",
          smooth: true,
          data: detail.telemetry.lapTrend.map((point) => point.lapTime),
          lineStyle: { color: "#0d1f3c", width: 2 },
          areaStyle: { color: "rgba(13,31,60,0.08)" },
          symbol: "circle",
          symbolSize: 6,
          itemStyle: { color: "#0d1f3c" },
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const item = Array.isArray(params) ? params[0] : params;
          if (!item || item.value == null) return "";
          return `${item.name}<br/>Volta: ${Number(item.value).toFixed(1)}s`;
        },
      },
    };
  }, [detail]);

  const k = detail?.list;
  const isClient = k?.ownership === "client";

  if (!kartId || !detail || !k) return null;

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
          <KartStatusBadge status={k.status} />
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
      panelClassName={KART_DETAIL_PANEL_CLASS}
      zIndexClass="z-[200]"
    >
      <div className="px-4 py-5 md:px-6">
        <nav
          aria-label="Abas do kart"
          className="-mx-1 mb-4 flex gap-0 border-b border-[rgba(17,17,17,0.08)]"
        >
          <button
            type="button"
            onClick={() => setDetailTab("overview")}
            className={`${DETAIL_TAB_CLASS} ${
              detailTab === "overview"
                ? "border-[#0d1f3c] text-[#0d1f3c]"
                : "border-transparent text-neutral-500"
            }`}
          >
            Visão geral
          </button>
          <button
            type="button"
            onClick={() => setDetailTab("technical")}
            className={`${DETAIL_TAB_CLASS} ${
              detailTab === "technical"
                ? "border-[#0d1f3c] text-[#0d1f3c]"
                : "border-transparent text-neutral-500"
            }`}
          >
            Histórico técnico
          </button>
        </nav>

        {detailTab === "technical" ? (
          <Section
            title="Histórico técnico"
            desc="Inspeções, manutenções e checklists completos em ordem cronológica."
          >
            <div id="kart-technical-timeline">
              <KartTechnicalTimeline entries={technicalTimeline} />
            </div>
          </Section>
        ) : (
        <div className="space-y-6">
            <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tabular-nums text-[#0d1f3c]">
                    Kart {String(k.number).padStart(2, "0")}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={metaBadge}>{k.categoryName}</span>
                    <span className={metaBadge}>
                      {isClient ? "Cliente" : "Próprio"}
                    </span>
                    <KartStatusBadge status={k.status} />
                  </div>
                  {isClient && k.ownerName ? (
                    <p className="mt-2 text-sm font-semibold text-[#0d1f3c]">
                      {k.ownerName}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm text-neutral-600">
                    {detail.availability}
                  </p>
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

            <Section title="Agenda e disponibilidade">
              <ul className="grid gap-2 sm:grid-cols-5">
                {detail.schedule.map((d) => (
                  <li
                    key={d.day}
                    className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-3"
                  >
                    <p className="text-[11px] font-bold uppercase text-neutral-500">
                      {d.day}
                    </p>
                    {d.slots.map((s) => (
                      <p
                        key={s.time}
                        className="mt-1 text-[11px] font-semibold text-[#0d1f3c]"
                      >
                        {s.time} {s.label}
                      </p>
                    ))}
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

            <Section title="Documentos">
              <ul className="space-y-2">
                {detail.documents.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] px-4 py-3 text-sm transition hover:border-accent/30 hover:bg-[#fafbfc]"
                    >
                      <span>
                        <span className="block font-semibold text-[#0d1f3c]">
                          {doc.label}
                        </span>
                        <span className="text-neutral-500">{doc.date}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c]">
                        Abrir
                        <HiArrowTopRightOnSquare className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Telemetria e performance">
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#fafbfc] px-4 py-3 ring-1 ring-[rgba(17,17,17,0.06)]">
                  <p className="text-[10px] font-bold uppercase text-neutral-500">
                    Média
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#0d1f3c]">
                    {detail.telemetry.avgLap}
                  </p>
                </div>
                <div className="rounded-xl bg-[#fafbfc] px-4 py-3 ring-1 ring-[rgba(17,17,17,0.06)]">
                  <p className="text-[10px] font-bold uppercase text-neutral-500">
                    Melhor tempo
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#0d1f3c]">
                    {detail.telemetry.bestLap}
                  </p>
                </div>
              </div>
              <ReactECharts
                option={chartOption}
                style={{ height: 220 }}
                opts={{ renderer: "svg" }}
              />
            </Section>
        </div>
        )}
      </div>
    </ScheduleDrawerShell>
  );
}
