"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import { SettingsCheckbox } from "@/components/admin/settings/settings-checkbox";
import type { KartScheduleStatus } from "@/lib/contracts/schedule";
import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { getAppServices } from "@/lib/data-source/app-services";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { resolveKartIdByNumber } from "@/lib/schedule/resolve-schedule-ids";
import {
  getKartByNumber,
  isKartBlockedForOperation,
} from "@/lib/karts-runtime-store";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";
import { useClientsReference } from "@/lib/query/hooks/use-clients";
import type { KartSwapOption } from "@/services/schedule/scheduleKartsService";
import type { RescheduleSlotOption } from "@/services/schedule/scheduleRescheduleService";
import { FinancialStatusBadge } from "./financial-status-badge";
import { KartStatusBadge } from "./kart-status-badge";
import { ScheduleActionModal } from "./schedule-action-modal";
import { ScheduleDrawerShell } from "./schedule-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import {
  adminBadgeWarningClass,
  adminCardClass,
  adminDrawerCancelBtnClass,
  adminDrawerDangerBtnClass,
  adminDrawerOutlineBtnClass,
  adminDrawerPrimaryBtnClass,
  adminDrawerSectionClass,
  adminLabelClass,
} from "@/lib/design";

type Props = {
  eventId: string | null;
  events: ScheduleEvent[];
  onClose: () => void;
  /** Volta para a lista de agendamentos do dia (sem fechar o fluxo do dia). */
  onBack?: () => void;
  onAction?: (message: string) => void;
};

function kartStatusFromEvent(
  type: string,
  kartNumber: number,
  eventStatus: string,
): KartScheduleStatus {
  if (type === "manutencao") return "manutencao";
  if (kartNumber <= 0) return "disponivel";

  const kart = getKartByNumber(kartNumber);
  if (!kart) return "reservado";

  if (isKartBlockedForOperation(kartNumber)) {
    return kart.status === "manutencao" ? "manutencao" : "bloqueado_checklist";
  }

  if (eventStatus === "em_andamento" || kart.status === "em_treino") {
    return "em_treino";
  }

  if (kart.status === "disponivel") return "disponivel";
  return "reservado";
}

const CONFIRMABLE_STATUSES = new Set([
  "pendente",
  "aguardando_pagamento",
  "reagendado",
]);

function InfoBox({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={adminDrawerSectionClass}>
      <p className={adminLabelClass}>{label}</p>
      <div className="mt-1.5 text-sm font-semibold text-[var(--ds-text-primary)]">{children}</div>
    </div>
  );
}

export function ScheduleDetailsDrawer({
  eventId,
  events,
  onClose,
  onBack,
  onAction,
}: Props) {
  const router = useRouter();
  const { schedule, scheduleReschedule, scheduleKarts } = getAppServices();
  const { data: reference } = useClientsReference();
  const { data: meta } = useScheduleMeta();
  const event = eventId
    ? schedule.getEventDetailFromList(events, eventId)
    : null;
  const open = Boolean(eventId && event);

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [swapKartOpen, setSwapKartOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [selectedRescheduleSlotId, setSelectedRescheduleSlotId] = useState("");
  const [selectedKartNumber, setSelectedKartNumber] = useState("");
  const [kartSwapConfirmOpen, setKartSwapConfirmOpen] = useState(false);
  const [rescheduleOptions, setRescheduleOptions] = useState<
    RescheduleSlotOption[]
  >([]);
  const [rescheduleOptionsLoading, setRescheduleOptionsLoading] =
    useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [kartOptions, setKartOptions] = useState<KartSwapOption[]>([]);
  const [kartOptionsLoading, setKartOptionsLoading] = useState(false);
  const [swappingKart, setSwappingKart] = useState(false);

  const pilotCategoryIds = useMemo(
    () =>
      event ? scheduleReschedule.getPilotCategoryIdsForEvent(event) : [],
    [event, scheduleReschedule],
  );

  useEffect(() => {
    if (!eventId || !event) return;
    setRescheduleOpen(false);
    setSwapKartOpen(false);
    setCancelConfirmOpen(false);
    setRescheduleDate(event.date);
    setSelectedRescheduleSlotId("");
    setSelectedKartNumber(String(event.kartNumber || ""));
    setKartSwapConfirmOpen(false);
  }, [eventId, event]);

  useEffect(() => {
    if (!event || !rescheduleDate || !rescheduleOpen) {
      setRescheduleOptions([]);
      return;
    }

    let cancelled = false;
    setRescheduleOptionsLoading(true);

    void scheduleReschedule
      .getRescheduleSlotOptions(
        rescheduleDate,
        event.id,
        events,
        pilotCategoryIds,
      )
      .then((options) => {
        if (!cancelled) setRescheduleOptions(options);
      })
      .catch(() => {
        if (!cancelled) setRescheduleOptions([]);
      })
      .finally(() => {
        if (!cancelled) setRescheduleOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    event,
    rescheduleDate,
    rescheduleOpen,
    events,
    pilotCategoryIds,
    scheduleReschedule,
  ]);

  useEffect(() => {
    if (!event || !swapKartOpen) {
      setKartOptions([]);
      return;
    }

    let cancelled = false;
    setKartOptionsLoading(true);

    void scheduleKarts
      .getKartSwapOptions(event.date, event.start, event.id, events)
      .then((options) => {
        if (!cancelled) setKartOptions(options);
      })
      .catch(() => {
        if (!cancelled) setKartOptions([]);
      })
      .finally(() => {
        if (!cancelled) setKartOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [event, swapKartOpen, events, scheduleKarts]);

  const selectedKartOption = kartOptions.find(
    (k) => String(k.number) === selectedKartNumber,
  );

  const notify = (msg: string) => {
    onAction?.(msg);
    onClose();
  };

  const rescheduleCategoryLabel = useMemo(() => {
    if (pilotCategoryIds.length === 0) return "categoria do piloto";
    const categories = reference?.categories ?? [];
    return pilotCategoryIds
      .map(
        (id) => categories.find((category) => category.id === id)?.name ?? id,
      )
      .join(", ");
  }, [pilotCategoryIds, reference?.categories]);

  if (!event) return null;

  const kartStatus = event.kartNumber
    ? kartStatusFromEvent(event.type, event.kartNumber, event.status)
    : "disponivel";
  const canConfirmLesson = CONFIRMABLE_STATUSES.has(event.status);
  const canRegisterResults =
    event.type !== "manutencao" &&
    event.student !== "—" &&
    event.status !== "cancelado";
  const canRegisterPayment =
    event.payment === "pendente" && event.type !== "manutencao";

  const categoryLabel = schedule.formatEventCategory(event.category);
  const eventStatusLabels = meta?.eventStatusLabels ?? {};

  const performKartSwap = async () => {
    if (!selectedKartNumber || !event) return;
    const num = Number(selectedKartNumber);

    if (getDataSourceMode() !== "http") {
      setSwapKartOpen(false);
      setKartSwapConfirmOpen(false);
      notify(`Kart alterado para Kart ${num} (mock).`);
      return;
    }

    const kartId =
      selectedKartOption?.kartId ?? (await resolveKartIdByNumber(num));

    if (!kartId) {
      onAction?.("Kart não encontrado na frota.");
      return;
    }

    setSwappingKart(true);
    try {
      await schedule.swapKart(event.id, kartId);
      setSwapKartOpen(false);
      setKartSwapConfirmOpen(false);
      notify(`Kart alterado para Kart ${num}.`);
    } catch {
      onAction?.("Não foi possível trocar o kart.");
    } finally {
      setSwappingKart(false);
    }
  };

  const handleKartSwapRequest = () => {
    if (!selectedKartNumber) return;
    const num = Number(selectedKartNumber);
    if (selectedKartOption?.reservedBy && num !== event.kartNumber) {
      setKartSwapConfirmOpen(true);
      return;
    }
    void performKartSwap();
  };

  const handleConfirmLesson = () => {
    void (async () => {
      try {
        const updated = await schedule.confirmEvent(event.id);
        if (updated) {
          onAction?.("Aula confirmada.");
          return;
        }
        onAction?.("Esta aula já está confirmada ou em andamento.");
      } catch {
        onAction?.("Não foi possível confirmar a aula.");
      }
    })();
  };

  const handleOpenRegistration = () => {
    router.push(`/admin/registro-aulas?event=${event.id}`);
    onClose();
  };

  const handleRegisterPayment = () => {
    router.push(`/admin/financeiro?scheduleEvent=${event.id}`);
    onClose();
  };

  const footerContent = (
    <DrawerFooterActions columns={3}>
      <button
        type="button"
        onClick={() => setRescheduleOpen(true)}
        className={adminDrawerOutlineBtnClass}
      >
        Remarcar
      </button>
      <button
        type="button"
        onClick={() => setCancelConfirmOpen(true)}
        className={adminDrawerDangerBtnClass}
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={() => setSwapKartOpen(true)}
        className={adminDrawerPrimaryBtnClass}
      >
        Trocar kart
      </button>
    </DrawerFooterActions>
  );

  const quickActionsCount = [
    canConfirmLesson,
    canRegisterResults,
    canRegisterPayment,
  ].filter(Boolean).length;

  return (
    <>
      <ScheduleDrawerShell
        open={open}
        onClose={onClose}
        onBack={onBack}
        title="Detalhe da aula"
        titleId="schedule-detail-drawer-title"
        footer={footerContent}
        zIndexClass="z-[225]"
      >
        <div className="space-y-3 p-4 md:p-5">
          {quickActionsCount > 0 ? (
            <section className={`${adminCardClass} p-4`}>
              <h2 className="text-sm font-bold text-[var(--ds-text-primary)]">Ações rápidas</h2>
              <div
                className={`mt-3 grid gap-2 ${
                  quickActionsCount > 1 ? "sm:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {canConfirmLesson ? (
                  <button
                    type="button"
                    onClick={handleConfirmLesson}
                    className="rounded-xl bg-emerald-700 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
                  >
                    Confirmar aula
                  </button>
                ) : null}
                {canRegisterResults ? (
                  <button
                    type="button"
                    onClick={handleOpenRegistration}
                    className={adminDrawerPrimaryBtnClass}
                  >
                    Registrar resultados
                  </button>
                ) : null}
                {canRegisterPayment ? (
                  <button
                    type="button"
                    onClick={handleRegisterPayment}
                    className={`rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider ring-1 transition hover:brightness-110 ${adminBadgeWarningClass}`}
                  >
                    Registrar pagamento
                  </button>
                ) : null}
              </div>
            </section>
          ) : null}

          <InfoBox label="Data">{schedule.formatDateLower(event.date)}</InfoBox>

          <InfoBox label="Aluno">{event.student}</InfoBox>

          {categoryLabel !== "—" ? (
            <InfoBox label="Categoria">{categoryLabel}</InfoBox>
          ) : null}

          <div className={adminDrawerSectionClass}>
            <p className={adminLabelClass}>Status</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase text-[var(--ds-text-primary)]">
                {eventStatusLabels[event.status]}
              </span>
              <FinancialStatusBadge status={event.payment} />
            </div>
          </div>

          {event.kartNumber > 0 ? (
            <div className={adminDrawerSectionClass}>
              <p className={adminLabelClass}>Kart</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[var(--ds-text-primary)]">
                  Kart {event.kartNumber}
                </span>
                <KartStatusBadge status={kartStatus} />
              </div>
            </div>
          ) : null}

          {event.studentPhone ? (
            <div className={adminDrawerSectionClass}>
              <p className={adminLabelClass}>Contato</p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--ds-text-primary)]">
                {event.studentPhone}
              </p>
            </div>
          ) : null}

          {event.objective ? (
            <InfoBox label="Objetivo do treino">{event.objective}</InfoBox>
          ) : null}
        </div>
      </ScheduleDrawerShell>

      <ScheduleActionModal
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        title="Remarcar aula"
        description={`Escolha a nova data e horário para ${event.student} (${rescheduleCategoryLabel}).`}
        maxWidthClass="max-w-lg"
        contentOverflow="visible"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRescheduleOpen(false)}
              className={`flex-1 ${adminDrawerCancelBtnClass}`}
            >
              Voltar
            </button>
            <button
              type="button"
              disabled={!selectedRescheduleSlotId || rescheduling}
              onClick={() => {
                void (async () => {
                  const slot = rescheduleOptions.find(
                    (o) => o.slot.id === selectedRescheduleSlotId,
                  );
                  if (!slot || !event) return;

                  setRescheduling(true);
                  try {
                    await scheduleReschedule.rescheduleEvent(
                      event.id,
                      rescheduleDate,
                      slot.slot,
                    );
                    setRescheduleOpen(false);
                    notify(
                      `Aula remarcada para ${schedule.formatDateShort(rescheduleDate)} às ${slot.slot.start}.`,
                    );
                  } catch {
                    onAction?.("Não foi possível remarcar a aula.");
                  } finally {
                    setRescheduling(false);
                  }
                })();
              }}
              className={`flex-1 ${adminDrawerPrimaryBtnClass}`}
            >
              {rescheduling ? "Remarcando…" : "Confirmar remarcação"}
            </button>
          </div>
        }
      >
        <div className="relative space-y-4">
          <div className="relative z-20">
            <p className={`mb-2 ${adminLabelClass}`}>Nova data</p>
            <SettingsDatePicker
              value={rescheduleDate}
              onChange={(d) => {
                setRescheduleDate(d);
                setSelectedRescheduleSlotId("");
              }}
              aria-label="Data da remarcação"
              lowercaseLabel
              disablePast
              popoverZIndexClass="z-[260]"
            />
          </div>
          <div>
            <p className={`mb-2 ${adminLabelClass}`}>
              Horários disponíveis · {rescheduleCategoryLabel}
            </p>
            <div className="max-h-56 space-y-2 overflow-y-auto app-scrollbar">
              {rescheduleOptionsLoading ? (
                <p className="text-sm text-[var(--ds-text-muted)]">
                  Carregando horários…
                </p>
              ) : rescheduleOptions.length === 0 ? (
                <p className="text-sm text-[var(--ds-text-muted)]">
                  Sem horários de {rescheduleCategoryLabel} para esta data.
                </p>
              ) : (
                rescheduleOptions.map((opt) => {
                  const selected = selectedRescheduleSlotId === opt.slot.id;
                  return (
                    <div
                      key={opt.slot.id}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                        selected
                          ? "border-accent/30 bg-accent/[0.06]"
                          : opt.available
                            ? "border-[var(--ds-border-field)] bg-[var(--ds-bg-muted)]"
                            : "border-[var(--ds-border-subtle)] bg-[var(--ds-bg-muted)] opacity-70"
                      }`}
                    >
                      <SettingsCheckbox
                        checked={selected}
                        disabled={!opt.available}
                        onChange={() =>
                          opt.available &&
                          setSelectedRescheduleSlotId(opt.slot.id)
                        }
                        aria-label={opt.label}
                      />
                      <button
                        type="button"
                        disabled={!opt.available}
                        onClick={() =>
                          opt.available &&
                          setSelectedRescheduleSlotId(opt.slot.id)
                        }
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block text-sm font-medium text-[var(--ds-text-primary)]">
                          {opt.label}
                        </span>
                        {opt.reason ? (
                          <span className="text-xs text-[var(--ds-text-muted)]">
                            {opt.reason}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </ScheduleActionModal>

      <ScheduleActionModal
        open={swapKartOpen}
        onClose={() => setSwapKartOpen(false)}
        title="Trocar kart"
        description={`Selecione o kart para ${event.student} no horário ${event.start}.`}
        maxWidthClass="max-w-md"
        contentOverflow="visible"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSwapKartOpen(false)}
              className={`flex-1 ${adminDrawerCancelBtnClass}`}
            >
              Voltar
            </button>
            <button
              type="button"
              disabled={!selectedKartNumber || swappingKart}
              onClick={handleKartSwapRequest}
              className={`flex-1 ${adminDrawerPrimaryBtnClass}`}
            >
              {swappingKart ? "Salvando…" : "Confirmar kart"}
            </button>
          </div>
        }
      >
        <div className="relative z-10 space-y-4">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Kart disponível
            </p>
            <SettingsDropdown
              aria-label="Selecionar kart"
              listClassName="!z-[250]"
              options={[
                { value: "", label: kartOptionsLoading ? "Carregando…" : "Selecionar kart" },
                ...kartOptions.map((k) => ({
                  value: String(k.number),
                  label: k.label,
                })),
              ]}
              value={selectedKartNumber}
              onSelect={setSelectedKartNumber}
            />
          </div>
          {selectedKartOption?.reservedBy ? (
            <p className="text-xs font-medium text-amber-800">
              Este kart já possui reserva no horário da aula. Será necessário
              confirmar a troca.
            </p>
          ) : null}
        </div>
      </ScheduleActionModal>

      <ConfirmDialog
        open={cancelConfirmOpen}
        title="Cancelar aula"
        message={`Deseja cancelar a aula de ${event.student} em ${schedule.formatDateShort(event.date)} às ${event.start}? Esta ação não pode ser desfeita.`}
        confirmLabel="Cancelar aula"
        cancelLabel="Voltar"
        onConfirm={() => {
          void (async () => {
            if (getDataSourceMode() !== "http") {
              setCancelConfirmOpen(false);
              notify("Aula cancelada (mock).");
              return;
            }

            try {
              await schedule.cancelEvent(event.id);
              setCancelConfirmOpen(false);
              notify("Aula cancelada.");
            } catch {
              onAction?.("Não foi possível cancelar a aula.");
              setCancelConfirmOpen(false);
            }
          })();
        }}
        onCancel={() => setCancelConfirmOpen(false)}
      />

      <ConfirmDialog
        open={kartSwapConfirmOpen}
        title="Confirmar troca de kart"
        message={`O Kart ${selectedKartNumber} já está reservado por ${selectedKartOption?.reservedBy ?? "outro piloto"} neste horário. Deseja confirmar a troca mesmo assim?`}
        confirmLabel="Confirmar troca"
        cancelLabel="Voltar"
        onConfirm={() => {
          void performKartSwap();
        }}
        onCancel={() => setKartSwapConfirmOpen(false)}
      />
    </>
  );
}
