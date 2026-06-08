"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { HiCalendarDays } from "react-icons/hi2";

import { KartReservaDayPicker } from "@/components/kart-reserva-day-picker";
import { ButtonNative } from "@/components/ui/button";
import { PageErrorState } from "@/components/ui/page-error-state";
import { adminCardInnerClass } from "@/lib/design";
import { useConfirmPilotBooking } from "@/lib/query/hooks/use-confirm-pilot-booking";
import { usePilotBookingSlots } from "@/lib/query/hooks/use-pilot-booking-slots";
import { StudentShell } from "../student-shell";
import { PilotBookingPilotPicker } from "./pilot-booking-pilot-picker";
import { PilotBookingSlotList } from "./pilot-booking-slot-list";

const BOOKING_HORIZON_DAYS = 30;
const BOOKING_CARD_CLASS = `${adminCardInnerClass} flex h-full min-h-[520px] flex-col`;

function dateToIsoLocal(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function isClosedMonday(d: Date): boolean {
  return d.getDay() === 1;
}

function maxBookableDate(): Date {
  return startOfDay(addDays(startOfToday(), BOOKING_HORIZON_DAYS));
}

function clampBookableDate(d: Date): Date {
  const min = startOfToday();
  const max = maxBookableDate();
  let x = startOfDay(d);
  if (isBefore(x, min)) x = min;
  if (isAfter(x, max)) x = max;
  while (isClosedMonday(x) && !isAfter(addDays(x, 1), max)) {
    x = addDays(x, 1);
  }
  if (isClosedMonday(x)) {
    x = min;
    while (isClosedMonday(x) && !isAfter(x, max)) {
      x = addDays(x, 1);
    }
  }
  return x;
}

function firstBookableDate(): Date {
  return clampBookableDate(startOfToday());
}

export function PilotBookingPage() {
  const [selectedDate, setSelectedDate] = useState(firstBookableDate);
  const [month, setMonth] = useState(firstBookableDate);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedPilotIds, setSelectedPilotIds] = useState<Set<string>>(
    () => new Set(),
  );

  const isoDate = dateToIsoLocal(selectedDate);
  const { data, isPending, isError, refetch } = usePilotBookingSlots(isoDate);
  const confirmBooking = useConfirmPilotBooking(isoDate);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string[] | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const selectedSlot = useMemo(
    () => data?.slots.find((slot) => slot.slotId === selectedSlotId) ?? null,
    [data?.slots, selectedSlotId],
  );

  const dateLabel = useMemo(() => {
    if (data?.dateLabel) return data.dateLabel;
    const label = format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [data?.dateLabel, selectedDate]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(clampBookableDate(date));
    setSelectedSlotId(null);
    setSelectedPilotIds(new Set());
    setSuccessMessage(null);
    setSuccessDetails(null);
    setBookingError(null);
  };

  const handleMonthChange = (date: Date) => {
    const today = startOfToday();
    const max = maxBookableDate();
    const candidate = startOfDay(date);
    if (isBefore(candidate, today)) {
      setMonth(today);
    } else if (isAfter(candidate, max)) {
      setMonth(max);
    } else {
      setMonth(candidate);
    }
  };

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setSelectedPilotIds(new Set());
    setBookingError(null);
  };

  const handleTogglePilot = (clientId: string) => {
    if (!selectedSlot?.eligiblePilots.some((p) => p.clientId === clientId)) {
      return;
    }

    setSelectedPilotIds((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }
      return next;
    });
    setBookingError(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || selectedPilotIds.size === 0) return;

    setBookingError(null);
    setSuccessMessage(null);
    setSuccessDetails(null);

    const eligibleIds = new Set(
      selectedSlot.eligiblePilots.map((p) => p.clientId),
    );
    const clientIds = [...selectedPilotIds].filter((id) => eligibleIds.has(id));
    if (clientIds.length === 0) {
      setBookingError("Selecione ao menos um piloto elegível para este horário.");
      return;
    }

    try {
      const result = await confirmBooking.mutateAsync({
        date: isoDate,
        slotId: selectedSlot.slotId,
        clientIds,
      });
      setSuccessMessage(result.message);
      if (result.bookings?.length) {
        setSuccessDetails(
          result.bookings.map(
            (entry) =>
              `${entry.clientName}${entry.kartNumber != null ? ` · Kart ${entry.kartNumber}` : ""}`,
          ),
        );
      } else {
        const pilot = selectedSlot.eligiblePilots.find(
          (p) => p.clientId === clientIds[0],
        );
        if (pilot) {
          setSuccessDetails([pilot.fullName]);
        }
      }
      setSelectedSlotId(null);
      setSelectedPilotIds(new Set());
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Não foi possível confirmar a reserva. Tente novamente.",
      );
    }
  };

  const selectedCount = selectedPilotIds.size;

  return (
    <StudentShell
      activeNav="agenda"
      mobileTitle="Reservar horário"
      pageHeader={
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.08)] bg-white text-accent shadow-sm">
              <HiCalendarDays className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[#0d1f3c] md:text-2xl">
                Reservar horário
              </h1>
              <p className="text-[13px] text-neutral-600 md:text-sm">
                Horários elegíveis para você e pilotos vinculados
              </p>
            </div>
          </div>
        </div>
      }
    >
      {isError && !data ? (
        <PageErrorState onRetry={() => void refetch()} />
      ) : (
        <div className="admin-page-stack">
          <div className="admin-page-grid grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-stretch">
            <section className={BOOKING_CARD_CLASS}>
              <h2 className="text-lg font-bold text-[#0d1f3c]">Data da reserva</h2>
              <p className="mt-1 text-[13px] text-neutral-600">
                Segundas-feiras sem operação · reservas até{" "}
                {BOOKING_HORIZON_DAYS} dias à frente
              </p>
              <div className="kart-reserva-rdp mt-4 w-full flex-1 rounded-xl bg-[#fafbfc] p-2">
                <KartReservaDayPicker
                  selected={selectedDate}
                  onSelect={handleSelectDate}
                  month={month}
                  onMonthChange={handleMonthChange}
                  maxDaysFromToday={BOOKING_HORIZON_DAYS}
                />
              </div>
            </section>

            <PilotBookingSlotList
              className="h-full"
              dateLabel={dateLabel}
              slots={data?.slots ?? []}
              loading={isPending}
              error={isError}
              onRetry={() => void refetch()}
              selectedSlotId={selectedSlotId}
              onSelectSlot={handleSelectSlot}
            />
          </div>

          {successMessage ? (
            <div
              className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-4 text-center"
              role="status"
            >
              <p className="text-sm font-semibold text-emerald-950">
                {successMessage}
              </p>
              {successDetails?.length ? (
                <ul className="mt-2 space-y-1 text-[13px] text-emerald-900">
                  {successDetails.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {selectedSlot ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-5 shadow-sm">
              <p className="text-center text-[13px] text-neutral-600">
                {selectedSlot.time}–{selectedSlot.end} · {selectedSlot.categoryName}{" "}
                · {selectedSlot.levelName}
              </p>

              <PilotBookingPilotPicker
                pilots={selectedSlot.eligiblePilots}
                selectedIds={selectedPilotIds}
                onToggle={handleTogglePilot}
              />

              {bookingError ? (
                <p
                  className="text-center text-[13px] font-semibold text-red-600"
                  role="alert"
                >
                  {bookingError}
                </p>
              ) : null}

              <ButtonNative
                type="button"
                variant="primary"
                hideTrailingDecoration
                disabled={confirmBooking.isPending || selectedCount === 0}
                onClick={() => void handleConfirmBooking()}
                className="min-w-[220px]"
              >
                {confirmBooking.isPending
                  ? "Confirmando…"
                  : selectedCount > 1
                    ? `Confirmar reserva em grupo (${selectedCount})`
                    : "Confirmar reserva"}
              </ButtonNative>
            </div>
          ) : null}
        </div>
      )}
    </StudentShell>
  );
}
