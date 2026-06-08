"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  HiCamera,
  HiBolt,
  HiPencilSquare,
} from "react-icons/hi2";
import {
  computeLapSummary,
  createDefaultLaps,
  validateLapRows,
  type LapRow,
} from "@/lib/lesson-registration-laps";
import type { TelemetrySessionOptionDTO } from "@/lib/contracts/telemetry/telemetry.types";
import type { LessonSessionDTO } from "@/lib/contracts/lessons/lesson.types";
import type { LapSummary } from "@/lib/lesson-registration-laps";
import type {
  GurgelSessionNotesDTO,
} from "@/lib/contracts/lessons/lesson-registration.types";
import {
  readImagePreview,
  runTimingSheetOcr,
  TimingSheetOcrError,
} from "@/lib/lesson-registration-ocr";
import { getAppServices } from "@/lib/data-source/app-services";
import {
  useLessonRegistration,
  useSaveLessonRegistration,
} from "@/lib/query/hooks/use-lessons";
import {
  getKartBlockReason,
  isKartBlockedForOperation,
} from "@/lib/karts-runtime-store";
import { OcrUploadZone } from "./ocr-upload-zone";
import { OcrReviewPanel } from "./ocr-review-panel";
import { TelemetryLinkPanel } from "./telemetry-link-panel";
import { LapsTable } from "./laps-table";
import { RegistrationSummaryCards } from "./registration-summary-cards";
import { GurgelNotesCard } from "./gurgel-notes-card";
import { lessonRegistrationSelectionClass } from "./lesson-registration-selection";

type RegistrationMethod = "ocr" | "telemetry" | "manual";

const EMPTY_NOTES: GurgelSessionNotesDTO = {
  positives: "",
  improvements: "",
  recommendations: "",
  general: "",
};

const METHODS: {
  id: RegistrationMethod;
  label: string;
  icon: typeof HiCamera;
  desc: string;
}[] = [
  {
    id: "ocr",
    label: "Foto cronometragem",
    icon: HiCamera,
    desc: "OCR com conferência",
  },
  {
    id: "telemetry",
    label: "Vincular telemetria",
    icon: HiBolt,
    desc: "Sessão já importada",
  },
  {
    id: "manual",
    label: "Inserção manual",
    icon: HiPencilSquare,
    desc: "Tabela rápida",
  },
];

type Props = {
  session: LessonSessionDTO;
  onFinalized: (message: string) => void;
  /** Drawer mobile: título fica no shell; ações (Editar) no header externo. */
  hideTitleHeader?: boolean;
  onHeaderActionsChange?: (actions: ReactNode) => void;
};

export function LessonSessionWorkspace({
  session,
  onFinalized,
  hideTitleHeader = false,
  onHeaderActionsChange,
}: Props) {
  const { data: saved } = useLessonRegistration(session.id);
  const saveRegistration = useSaveLessonRegistration();
  const { lessons, schedule } = getAppServices();
  const isConcluded = session.status === "concluida";
  const hasSavedRegistration = Boolean(saved);
  const kartBlocked =
    session.kartNumber > 0 && isKartBlockedForOperation(session.kartNumber);
  const kartBlockReason = kartBlocked
    ? getKartBlockReason(session.kartNumber)
    : null;

  const [editingConcluded, setEditingConcluded] = useState(false);
  const locked = isConcluded && !editingConcluded;

  const [method, setMethod] = useState<RegistrationMethod | null>(
    saved?.method ?? null,
  );
  const [ocrPhase, setOcrPhase] = useState<"upload" | "review" | "done">(
    saved?.method === "ocr" ? "done" : "upload",
  );
  const [ocrImage, setOcrImage] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [laps, setLaps] = useState<LapRow[]>(
    saved?.laps ?? createDefaultLaps(5),
  );
  const [notes, setNotes] = useState<GurgelSessionNotesDTO>(
    saved?.notes ?? EMPTY_NOTES,
  );
  const [telemetryId, setTelemetryId] = useState<string | null>(
    saved?.telemetryId ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [autosaveHint, setAutosaveHint] = useState<string | null>(null);

  const issues = useMemo(() => validateLapRows(laps), [laps]);
  const lapSummary = useMemo(() => computeLapSummary(laps), [laps]);

  const telemetrySummary = useMemo((): LapSummary | null => {
    const tel = lessons.getTelemetrySessionOptions().find(
      (t) => t.id === telemetryId,
    );
    if (!tel) return null;
    return {
      bestLap: `${tel.bestLap}s`,
      bestS1: "—",
      bestS2: "—",
      bestS3: "—",
      consistency: tel.consistency,
      idealLap: `${tel.idealLap}s`,
      lapCount: tel.lapCount,
    };
  }, [telemetryId, lessons]);

  const summary =
    method === "telemetry" && telemetrySummary ? telemetrySummary : lapSummary;

  useEffect(() => {
    setEditingConcluded(false);
    setMethod(saved?.method ?? null);
    setLaps(saved?.laps ?? createDefaultLaps(5));
    setNotes(saved?.notes ?? EMPTY_NOTES);
    setTelemetryId(saved?.telemetryId ?? null);
    setOcrPhase(saved?.method === "ocr" ? "done" : "upload");
    setOcrImage("");
    setOcrError(null);
  }, [session.id, saved]);

  useEffect(() => {
    if (locked) return;
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(
          `lesson-reg-draft-${session.id}`,
          JSON.stringify({ laps, notes, method, telemetryId }),
        );
        setAutosaveHint("Rascunho salvo");
        window.setTimeout(() => setAutosaveHint(null), 2000);
      } catch {
        /* ignore */
      }
    }, 800);
    return () => window.clearTimeout(t);
  }, [session.id, laps, notes, method, telemetryId, locked]);

  const handleOcrFile = async (file: File) => {
    setOcrLoading(true);
    setOcrError(null);
    let preview = "";
    try {
      preview = await readImagePreview(file);
      setOcrImage(preview);
      const result = await runTimingSheetOcr(file);
      if (result.imageUrl) setOcrImage(result.imageUrl);
      setLaps(result.laps);
      setOcrPhase("review");
      setMethod("ocr");
    } catch (err) {
      const message =
        err instanceof TimingSheetOcrError
          ? err.message
          : "Não foi possível processar a foto. Tente outra imagem ou use inserção manual.";
      setOcrError(message);
      if (preview) {
        setLaps(createDefaultLaps(5));
        setOcrPhase("review");
        setMethod("ocr");
      } else {
        setOcrPhase("upload");
      }
    } finally {
      setOcrLoading(false);
    }
  };

  const handleTelemetrySelect = (opt: TelemetrySessionOptionDTO) => {
    setTelemetryId(opt.id);
    setMethod("telemetry");
  };

  const handleFinalize = useCallback(async () => {
    if (kartBlocked) return;
    if (issues.length > 0 && method !== "telemetry") return;
    setSaving(true);
    try {
      await saveRegistration.mutateAsync({
        sessionId: session.id,
        laps,
        notes,
        method: method ?? "manual",
        telemetryId: telemetryId ?? undefined,
      });
      try {
        localStorage.removeItem(`lesson-reg-draft-${session.id}`);
      } catch {
        /* ignore */
      }
      setEditingConcluded(false);
      onFinalized(
        `Registro de ${session.studentName} finalizado e vinculado ao histórico.`,
      );
    } finally {
      setSaving(false);
    }
  }, [
    kartBlocked,
    issues.length,
    method,
    session,
    laps,
    notes,
    telemetryId,
    onFinalized,
    saveRegistration,
  ]);

  const renderMethodPicker = () => (
    <div>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Método de registro
      </p>
      <div className="grid gap-2 overflow-visible p-0.5 sm:grid-cols-3">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={locked}
            onClick={() => {
              setMethod(m.id);
              if (m.id !== "ocr") setOcrPhase("upload");
            }}
            className={`rounded-2xl p-4 text-left transition disabled:cursor-default ${lessonRegistrationSelectionClass(method === m.id)}`}
          >
            <m.icon className="h-5 w-5 text-[#0d1f3c]" />
            <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-[#0d1f3c]">
              {m.label}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">{m.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderLockedMethodBadge = () => {
    const active = METHODS.find((m) => m.id === method);
    if (!active) return null;
    return (
      <div
        className={`m-0.5 rounded-2xl p-4 ${lessonRegistrationSelectionClass(true)}`}
      >
        <active.icon className="h-5 w-5 text-[#0d1f3c]" />
        <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-[#0d1f3c]">
          {active.label}
        </p>
      </div>
    );
  };

  const renderMethodContent = () => {
    if (!method) return null;

    if (method === "ocr") {
      if (locked) {
        return (
          <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Tempos registrados
            </p>
            <LapsTable rows={laps} onChange={() => {}} readOnly issues={[]} />
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {ocrPhase === "upload" ? (
            <div className="space-y-3">
              <OcrUploadZone onFile={handleOcrFile} loading={ocrLoading} />
              {ocrError ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-900"
                >
                  {ocrError}
                </p>
              ) : null}
            </div>
          ) : null}
          {ocrPhase === "review" ? (
            <div className="space-y-3">
              {ocrError ? (
                <p
                  role="alert"
                  className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                >
                  {ocrError}
                </p>
              ) : null}
              <OcrReviewPanel
                imageUrl={ocrImage}
                laps={laps}
                issues={issues}
                onLapsChange={setLaps}
                onConfirm={() => {
                  setOcrError(null);
                  setOcrPhase("done");
                }}
                onCancel={() => {
                  setOcrPhase("upload");
                  setOcrImage("");
                  setOcrError(null);
                }}
              />
            </div>
          ) : null}
          {ocrPhase === "done" ? (
            <>
              <p className="rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Tempos conferidos. Ajuste abaixo se necessário antes de
                finalizar.
              </p>
              <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
                <LapsTable rows={laps} onChange={setLaps} issues={issues} />
              </div>
            </>
          ) : null}
        </div>
      );
    }

    if (method === "telemetry") {
      return (
        <TelemetryLinkPanel
          pilotName={session.studentName}
          selectedId={telemetryId}
          onSelect={handleTelemetrySelect}
          readOnly={locked}
        />
      );
    }

    return (
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Tempos manuais
        </p>
        <LapsTable
          rows={laps}
          onChange={setLaps}
          issues={issues}
          readOnly={locked}
        />
      </div>
    );
  };

  const showSummary =
    Boolean(summary) &&
    Boolean(method) &&
    (method === "manual" || method === "ocr" || method === "telemetry");

  const concludedEditActions = useMemo((): ReactNode => {
    if (!isConcluded || !hasSavedRegistration) return null;

    const cancelLabel = hideTitleHeader ? "Cancelar" : "Cancelar edição";
    const saveLabel = hideTitleHeader ? "Salvar" : "Salvar alterações";
    const saveBtnClass = hideTitleHeader
      ? "inline-flex items-center justify-center rounded-xl bg-[#0d1f3c] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition hover:brightness-110 disabled:opacity-40"
      : "inline-flex min-w-[10rem] items-center justify-center rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition hover:brightness-110 disabled:opacity-40";

    if (editingConcluded) {
      return (
        <>
          <button
            type="button"
            onClick={() => setEditingConcluded(false)}
            className="btn-outline-sm bg-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={
              saving ||
              kartBlocked ||
              !method ||
              (method !== "telemetry" && issues.length > 0) ||
              (method === "telemetry" && !telemetryId)
            }
            onClick={handleFinalize}
            className={saveBtnClass}
          >
            {saving ? "Salvando…" : saveLabel}
          </button>
        </>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setEditingConcluded(true)}
        className="btn-outline-sm bg-white"
      >
        Editar
      </button>
    );
  }, [
    kartBlocked,
    isConcluded,
    hasSavedRegistration,
    editingConcluded,
    saving,
    method,
    issues.length,
    telemetryId,
    handleFinalize,
    hideTitleHeader,
  ]);

  useEffect(() => {
    if (!hideTitleHeader || !onHeaderActionsChange) return;
    onHeaderActionsChange(concludedEditActions);
  }, [hideTitleHeader, onHeaderActionsChange, concludedEditActions]);

  useEffect(() => {
    if (!hideTitleHeader || !onHeaderActionsChange) return;
    return () => {
      onHeaderActionsChange(null);
    };
  }, [hideTitleHeader, onHeaderActionsChange]);

  return (
    <div className="min-w-0 space-y-6">
      {kartBlocked ? (
        <p
          role="alert"
          className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950"
        >
          Kart {session.kartNumber} bloqueado
          {kartBlockReason ? ` (${kartBlockReason})` : ""}. Resolva a manutenção
          antes de finalizar o registro.
        </p>
      ) : null}
      {!hideTitleHeader ? (
        <header className="-mx-4 border-b border-[rgba(17,17,17,0.08)] px-4 pb-4 md:-mx-6 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-xl font-bold text-[#0d1f3c]">
                  {session.studentName}
                </h3>
                {autosaveHint ? (
                  <span
                    className="text-[11px] font-medium text-emerald-700"
                    role="status"
                  >
                    {autosaveHint}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                {schedule.formatDateShort(session.date)} ·{" "}
                {session.start}–{session.end}
              </p>
            </div>
            {concludedEditActions ? (
              <div className="flex shrink-0 flex-wrap gap-2">
                {concludedEditActions}
              </div>
            ) : null}
          </div>
        </header>
      ) : autosaveHint ? (
        <p
          className="text-[11px] font-medium text-emerald-700"
          role="status"
        >
          {autosaveHint}
        </p>
      ) : null}

      <div className="min-w-0 space-y-6 overflow-visible p-0.5">
        {locked && !hasSavedRegistration ? (
          <p className="rounded-xl border border-dashed border-neutral-200 bg-white px-4 py-8 text-center text-sm text-neutral-500">
            Nenhum registro salvo para esta sessão.
          </p>
        ) : (
          <>
            {locked ? renderLockedMethodBadge() : renderMethodPicker()}

            {renderMethodContent()}

            {showSummary ? (
              <div>
                <p className="mb-3 text-sm font-bold text-[#0d1f3c]">
                  Análise resumida
                </p>
                <RegistrationSummaryCards summary={summary!} />
              </div>
            ) : null}

            <GurgelNotesCard
              notes={notes}
              onChange={setNotes}
              readOnly={locked}
            />

            {!locked && !editingConcluded ? (
              <button
                type="button"
                disabled={
                  saving ||
                  kartBlocked ||
                  !method ||
                  (method !== "telemetry" && issues.length > 0) ||
                  (method === "telemetry" && !telemetryId)
                }
                onClick={handleFinalize}
                className="w-full rounded-xl bg-[#0d1f3c] py-4 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg transition hover:brightness-110 disabled:opacity-40"
              >
                {saving ? "Salvando…" : "Finalizar registro"}
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
