"use client";

import type { InspectionTypeKey, InspectionTypeOption } from "@/lib/contracts/maintenance";
import { useInspectionTemplate } from "@/lib/query/hooks/use-inspection-template";

import { HiXMark } from "react-icons/hi2";

type Props = {
  kartNumber: number;
  inspectionType: InspectionTypeKey;
  responsible: string;
  dateTime: string;
  onSaveDraft: () => void;
  onFinish: () => void;
  onOpenOs: () => void;
  onClose: () => void;
};

export function InspectionHeader({
  kartNumber,
  inspectionType,
  responsible,
  dateTime,
  onSaveDraft,
  onFinish,
  onOpenOs,
  onClose,
}: Props) {
  const { data: template } = useInspectionTemplate();
  const options = (template?.typeOptions ?? []) as InspectionTypeOption[];
  const typeLabel =
    options.find((t) => t.key === inspectionType)?.label ?? "—";

  return (
    <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:px-6 md:py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3 lg:block">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                Paddock · Inspeção técnica
              </p>
              <h1 className="text-xl font-bold tracking-tight text-[#0d1f3c] md:text-2xl">
                Nova inspeção
              </h1>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-neutral-500 transition hover:bg-neutral-100 lg:hidden"
              aria-label="Fechar"
            >
              <HiXMark className="h-6 w-6" />
            </button>
          </div>
          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600">
            <div>
              <dt className="inline font-bold uppercase text-neutral-400">
                Kart{" "}
              </dt>
              <dd className="inline font-bold text-[#0d1f3c]">
                #{kartNumber}
              </dd>
            </div>
            <div>
              <dt className="inline font-bold uppercase text-neutral-400">
                Tipo{" "}
              </dt>
              <dd className="inline font-semibold">{typeLabel}</dd>
            </div>
            <div>
              <dt className="inline font-bold uppercase text-neutral-400">
                Resp.{" "}
              </dt>
              <dd className="inline font-semibold">{responsible}</dd>
            </div>
            <div>
              <dt className="inline font-bold uppercase text-neutral-400">
                Data{" "}
              </dt>
              <dd className="inline font-semibold tabular-nums">{dateTime}</dd>
            </div>
          </dl>
        </div>
        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c] transition hover:border-accent/30"
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            onClick={onFinish}
            className="rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md transition hover:brightness-110"
          >
            Finalizar inspeção
          </button>
          <button
            type="button"
            onClick={onOpenOs}
            className="rounded-xl border-2 border-accent/40 bg-accent/5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-accent transition hover:bg-accent/10"
          >
            Abrir OS
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2.5 text-neutral-500 transition hover:bg-neutral-100"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
