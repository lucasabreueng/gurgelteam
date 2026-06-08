"use client";

import { useEffect, useMemo } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import Image from "next/image";
import { ThemedECharts } from "@/components/charts/themed-echarts";
import type { EChartsOption } from "echarts";
import { HiXMark } from "react-icons/hi2";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import { getInventoryPartById } from "@/lib/inventory-parts-store";
import { StockStatusBadge } from "./stock-status-badge";

type Props = {
  partId: string | null;
  onClose: () => void;
};

export function PartDetailsDrawer({ partId, onClose }: Props) {
  const part = partId ? getInventoryPartById(partId) : null;
  const detail = partId ? InventoryServiceMock.getPartDetail(partId, part) : null;
  useDrawerBodyLock(Boolean(partId));


  useEffect(() => {
    if (!partId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      };
  }, [partId, onClose]);

  const costChart: EChartsOption = useMemo(() => {
    if (!detail) return {};
    return {
      grid: { left: 48, right: 16, top: 16, bottom: 28 },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const item = Array.isArray(params) ? params[0] : params;
          if (!item?.value) return "";
          const val = Number(item.value).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          return `${item.name}<br/>R$ ${val}`;
        },
      },
      xAxis: {
        type: "category",
        data: detail.costHistory.map((c) => c.month),
      },
      yAxis: { type: "value", splitLine: { show: false } },
      series: [
        {
          type: "bar",
          data: detail.costHistory.map((c) => c.value),
          itemStyle: { color: "#0d1f3c", borderRadius: [4, 4, 0, 0] },
        },
      ],
    };
  }, [detail]);

  if (!partId || !detail) return null;

  const { part: partData } = detail;

  return (
    <div className="fixed inset-0 z-[228] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="app-drawer-panel relative flex h-full w-full max-w-[min(100vw,720px)] flex-col bg-[var(--ds-bg-panel)] shadow-2xl"
      >
        <header className="shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-[#0d1f3c]">
                  {partData.name}
                </h2>
                <StockStatusBadge level={partData.stockLevel} />
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)]"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {partData.image ? (
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm">
                  <Image
                    src={partData.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:720px) 50vw, 360px"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white text-sm text-neutral-400">
                  Sem imagem
                </div>
              )}

              <section className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
                <dl className="grid flex-1 gap-3 sm:grid-cols-1 text-sm">
                  <div>
                    <dt className="text-neutral-500">Estoque atual</dt>
                    <dd>
                      {partData.stock} (mín. {partData.minStock})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Custo unitário</dt>
                    <dd>{InventoryServiceMock.formatCurrency(partData.unitCost)}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Categoria</dt>
                    <dd>{partData.category}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Fornecedor</dt>
                    <dd>{partData.supplierName}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
              <h3 className="font-bold text-[#0d1f3c]">Histórico de uso</h3>
              <ul className="mt-3 space-y-2">
                {detail.usageHistory.map((u) => (
                  <li
                    key={u.id}
                    className="rounded-xl bg-[#fafbfc] px-3 py-2 text-sm ring-1 ring-[rgba(17,17,17,0.06)]"
                  >
                    <p className="font-semibold text-[#0d1f3c]">
                      {u.date} · Kart {String(u.kartNumber).padStart(2, "0")}
                    </p>
                    <p className="text-neutral-600">
                      {u.osNumber} · {u.quantity} un. · {u.mechanic}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#0d1f3c]">Karts vinculados</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {detail.linkedKarts.map((k) => (
                    <li key={k.number} className="flex justify-between">
                      <span>Kart {String(k.number).padStart(2, "0")}</span>
                      <span className="text-neutral-500">{k.lastUse}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#0d1f3c]">OS vinculadas</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {detail.linkedOs.map((o) => (
                    <li key={o.osNumber}>
                      <p className="font-semibold">{o.osNumber}</p>
                      <p className="text-neutral-500">
                        {o.status} · {o.date}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
              <h3 className="font-bold text-[#0d1f3c]">Custo histórico</h3>
              <ThemedECharts
                option={costChart}
                style={{ height: 180 }}
                opts={{ renderer: "svg" }}
              />
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
