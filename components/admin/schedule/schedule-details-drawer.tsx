"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import { SettingsCheckbox } from "@/components/admin/settings/settings-checkbox";
import type { KartScheduleStatus } from "@/lib/contracts/schedule";
import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { getAppServices } from "@/lib/data-source/app-services";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";
import { ScheduleKartsServiceMock } from "@/services/schedule/scheduleKartsServiceMock";
import { ScheduleRescheduleServiceMock } from "@/services/schedule/scheduleRescheduleServiceMock";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";
import { FinancialStatusBadge } from "./financial-status-badge";
import { KartStatusBadge } from "./kart-status-badge";
import { ScheduleActionModal } from "./schedule-action-modal";
import { ScheduleDrawerShell } from "./schedule-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";

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
): KartScheduleStatus {
  if (type === "manutencao") return "manutencao";
  if (kartNumber === 12) return "bloqueado_checklist";
  if (type === "treino_avancado" || type === "em_andamento") return "em_treino";
  return "reservado";
}

function InfoBox({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <div className="mt-1.5 text-sm font-semibold text-[#0d1f3c]">{children}</div>
    </div>
  );
}

function pilotCategoryLabel(categoryIds: string[]): string {
  if (categoryIds.length === 0) return "categoria do piloto";
  return categoryIds
    .map(
      (id) =>
        SettingsServiceMock.getKartCategories().find((c) => c.id === id)
          ?.name ?? id,
    )
    .join(", ");
}

export function ScheduleDetailsDrawer({
  eventId,
  events,
  onClose,
  onBack,
  onAction,
}: Props) {
  const schedule = getAppServices().schedule;
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

  const pilotCategoryIds = useMemo(
    () =>
      event ? ScheduleRescheduleServiceMock.getPilotCategoryIdsForEvent(event) : [],
    [event],
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

  const rescheduleOptions = useMemo(() => {
    if (!event || !rescheduleDate) return [];
    return ScheduleRescheduleServiceMock.getRescheduleSlotOptions(
      rescheduleDate,
      event.id,
      events,
      pilotCategoryIds,
    );
  }, [event, rescheduleDate, pilotCategoryIds]);

  const kartOptions = useMemo(() => {
    if (!event) return [];
    return ScheduleKartsServiceMock.getKartSwapOptions(
      event.date,
      event.start,
      event.id,
    );
  }, [event]);

  const selectedKartOption = kartOptions.find(
    (k) => String(k.number) === selectedKartNumber,
  );

  const notify = (msg: string) => {
    onAction?.(msg);
    onClose();
  };

  if (!event) return null;

  const kartStatus = event.kartNumber
    ? kartStatusFromEvent(event.type, event.kartNumber)
    : "disponivel";

  const categoryLabel = schedule.formatEventCategory(event.category);
  const eventStatusLabels = meta?.eventStatusLabels ?? {};
  const rescheduleCategoryLabel = pilotCategoryLabel(pilotCategoryIds);

  const handleKartSwapRequest = () => {
    if (!selectedKartNumber) return;
    const num = Number(selectedKartNumber);
    if (selectedKartOption?.reservedBy && num !== event.kartNumber) {
      setKartSwapConfirmOpen(true);
      return;
    }
    setSwapKartOpen(false);
    notify(`Kart alterado para Kart ${num} (mock).`);
  };

  const footerContent = (
    <DrawerFooterActions columns={3}>
      <button
        type="button"
        onClick={() => setRescheduleOpen(true)}
        className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-neutral-50"
      >
        Remarcar
      </button>
      <button
        type="button"
        onClick={() => setCancelConfirmOpen(true)}
        className="rounded-xl border border-red-200 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-red-700 transition hover:bg-red-50"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={() => setSwapKartOpen(true)}
        className="rounded-xl bg-[#0d1f3c] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
      >
        Trocar kart
      </button>
    </DrawerFooterActions>
  );

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
          <InfoBox label="Data">
            <span className="font-mono tabular-nums">
              {schedule.formatDateShort(event.date)}
            </span>
          </InfoBox>

          <InfoBox label="Aluno">{event.student}</InfoBox>

          {categoryLabel !== "—" ? (
            <InfoBox label="Categoria">{categoryLabel}</InfoBox>
          ) : null}

          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Status
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-[#0d1f3c]/10 px-2 py-1 text-[10px] font-bold uppercase text-[#0d1f3c]">
                {eventStatusLabels[event.status]}
              </span>
              <FinancialStatusBadge status={event.payment} />
            </div>
          </div>

          {event.kartNumber > 0 ? (
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Kart
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#0d1f3c]">
                  Kart {event.kartNumber}
                </span>
                <KartStatusBadge status={kartStatus} />
              </div>
            </div>
          ) : null}

          {event.studentPhone ? (
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Contato
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#0d1f3c]">
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
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRescheduleOpen(false)}
              className="flex-1 rounded-xl border border-[rgba(13,31,60,0.2)] py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]"
            >
              Voltar
            </button>
            <button
              type="button"
              disabled={!selectedRescheduleSlotId}
              onClick={() => {
                const slot = rescheduleOptions.find(
                  (o) => o.slot.id === selectedRescheduleSlotId,
                );
                if (!slot) return;
                setRescheduleOpen(false);
                notify(
                  `Aula remarcada para ${schedule.formatDateShort(rescheduleDate)} às ${slot.slot.start} (mock).`,
                );
              }}
              className="flex-1 rounded-xl bg-[#0d1f3c] py-3 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-40"
            >
              Confirmar remarcação
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Nova data
            </p>
            <SettingsDatePicker
              value={rescheduleDate}
              onChange={(d) => {
                setRescheduleDate(d);
                setSelectedRescheduleSlotId("");
              }}
              aria-label="Data da remarcação"
            />
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Horários disponíveis · {rescheduleCategoryLabel}
            </p>
            <div className="max-h-56 space-y-2 overflow-y-auto app-scrollbar">
              {rescheduleOptions.length === 0 ? (
                <p className="text-sm text-neutral-500">
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
                          ? "border-accent/30 bg-[rgba(13,31,60,0.04)]"
                          : opt.available
                            ? "border-[rgba(17,17,17,0.1)] bg-[#fafbfc]"
                            : "border-[rgba(17,17,17,0.06)] bg-neutral-50 opacity-70"
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
                        <span className="block text-sm font-medium text-[#0d1f3c]">
                          {opt.label}
                        </span>
                        {opt.reason ? (
                          <span className="text-xs text-neutral-500">
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
              className="flex-1 rounded-xl border border-[rgba(13,31,60,0.2)] py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]"
            >
              Voltar
            </button>
            <button
              type="button"
              disabled={!selectedKartNumber}
              onClick={handleKartSwapRequest}
              className="flex-1 rounded-xl bg-[#0d1f3c] py-3 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-40"
            >
              Confirmar kart
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
                { value: "", label: "Selecionar kart" },
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
          setCancelConfirmOpen(false);
          notify("Aula cancelada (mock).");
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
          setKartSwapConfirmOpen(false);
          setSwapKartOpen(false);
          notify(`Kart alterado para Kart ${selectedKartNumber} (mock).`);
        }}
        onCancel={() => setKartSwapConfirmOpen(false)}
      />
    </>
  );
}
