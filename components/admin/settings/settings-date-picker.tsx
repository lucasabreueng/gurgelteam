"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isValid, parseISO, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HiOutlineCalendar, HiOutlineChevronDown } from "react-icons/hi2";
import "react-day-picker/style.css";
import { DayPickerAppDropdown } from "@/components/kart-reserva-day-picker";
import { usePreferNativeSelect } from "@/lib/hooks/use-prefer-native-select";
import {
  adminComboFieldShellClass,
  adminComboFieldTriggerClass,
} from "@/lib/design/classes";

type Props = {
  value: string;
  onChange: (isoDate: string) => void;
  disabled?: boolean;
  "aria-label"?: string;
  /** Ano inicial no dropdown (padrão: ano atual − 1) */
  fromYear?: number;
  /** Ano final no dropdown (padrão: ano atual + 2) */
  toYear?: number;
  /** Bloqueia datas futuras (útil para data de nascimento) */
  disableFuture?: boolean;
  /** Bloqueia datas anteriores a hoje (agendamentos) */
  disablePast?: boolean;
  /** Exibe o rótulo/placeholder em minúsculas (ex.: data de nascimento) */
  lowercaseLabel?: boolean;
  /** z-index do popover (útil dentro de modais) */
  popoverZIndexClass?: string;
  /** Texto quando nenhuma data está selecionada */
  placeholder?: string;
};

const pickerFieldWrapClass = `h-12 min-h-12 ${adminComboFieldShellClass}`;

const nativeDateFieldWrapClass = `flex h-12 min-h-12 w-full min-w-0 items-stretch ${adminComboFieldShellClass}`;

const popoverPanelClass =
  "settings-date-picker-popover absolute left-0 right-0 top-full z-[200] mt-2 min-w-[280px] rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-elevated)] p-3 shadow-[var(--ds-shadow-popover)] sm:left-0 sm:right-auto sm:min-w-[320px]";

const nativeDateIconSlotClass =
  "flex w-11 shrink-0 items-center justify-center text-[var(--ds-text-muted)]";

const nativeDateInputClass =
  "app-native-date-input h-full min-h-0 min-w-0 flex-1 cursor-pointer border-0 bg-transparent px-2 pr-3 text-left text-[var(--ds-text-body)] outline-none transition disabled:cursor-not-allowed disabled:opacity-50";

function isoToDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const d = parseISO(iso);
  return isValid(d) ? d : undefined;
}

function dateToIso(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

type NativeDateInputProps = Pick<
  Props,
  | "value"
  | "onChange"
  | "disabled"
  | "aria-label"
  | "fromYear"
  | "toYear"
  | "disableFuture"
  | "disablePast"
>;

function SettingsNativeDateInput({
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
  fromYear,
  toYear,
  disableFuture = false,
  disablePast = false,
}: NativeDateInputProps) {
  const currentYear = new Date().getFullYear();
  const rangeStartYear = fromYear ?? currentYear - 1;
  const rangeEndYear = toYear ?? currentYear + 2;
  const minDate = disablePast
    ? dateToIso(startOfToday())
    : `${rangeStartYear}-01-01`;
  const maxDate = disableFuture
    ? dateToIso(new Date())
    : `${rangeEndYear}-12-31`;

  return (
    <div className={nativeDateFieldWrapClass}>
      <span className={nativeDateIconSlotClass} aria-hidden>
        <HiOutlineCalendar className="h-5 w-5 shrink-0" />
      </span>
      <input
        type="date"
        value={value}
        min={minDate}
        max={maxDate}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className={nativeDateInputClass}
      />
    </div>
  );
}

/** Seletor de data: calendário no desktop; `<input type="date">` nativo no mobile/tablet. */
export function SettingsDatePicker({
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
  fromYear,
  toYear,
  disableFuture = false,
  disablePast = false,
  lowercaseLabel = false,
  placeholder = "Selecionar data",
  popoverZIndexClass = "z-[200]",
}: Props) {
  const preferNativeDateInput = usePreferNativeSelect();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = isoToDate(value);
  const currentYear = new Date().getFullYear();
  const rangeStartYear = fromYear ?? currentYear - 1;
  const rangeEndYear = toYear ?? currentYear + 2;
  const defaultMonth = selected ?? new Date(Math.min(currentYear - 20, rangeEndYear), 0, 1);
  const [month, setMonth] = useState(defaultMonth);

  useEffect(() => {
    const d = isoToDate(value);
    if (!d) return;
    setMonth((prev) => {
      if (
        prev.getFullYear() === d.getFullYear() &&
        prev.getMonth() === d.getMonth()
      ) {
        return prev;
      }
      return d;
    });
  }, [value]);

  useEffect(() => {
    if (preferNativeDateInput || !open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, preferNativeDateInput]);

  if (preferNativeDateInput) {
    return (
      <SettingsNativeDateInput
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
        fromYear={fromYear}
        toYear={toYear}
        disableFuture={disableFuture}
        disablePast={disablePast}
      />
    );
  }

  const today = startOfToday();
  const disabledDays = [
    ...(disableFuture ? [{ after: new Date() }] : []),
    ...(disablePast ? [{ before: today }] : []),
  ];

  const displayLabel = selected
    ? format(selected, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : placeholder;
  const labelText = lowercaseLabel
    ? displayLabel.toLocaleLowerCase("pt-BR")
    : displayLabel;

  return (
    <div
      ref={rootRef}
      data-open={open ? "true" : undefined}
      className={pickerFieldWrapClass}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`${adminComboFieldTriggerClass} justify-between gap-2`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpen((o) => !o);
        }}
      >
        <span
          className={`flex min-w-0 items-center gap-2.5 text-[14px] text-[var(--ds-text-body)] ${
            lowercaseLabel ? "" : "capitalize"
          }`}
        >
          <HiOutlineCalendar
            className="h-5 w-5 shrink-0 text-[var(--ds-text-muted)]"
            aria-hidden
          />
          <span className="truncate">{labelText}</span>
        </span>
        <HiOutlineChevronDown
          className={`h-5 w-5 shrink-0 text-[var(--ds-text-muted)] transition ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="dialog"
          className={`${popoverPanelClass} ${popoverZIndexClass}${lowercaseLabel ? " lowercase" : ""}`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="settings-date-picker-rdp w-full">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(d) => {
                if (d) {
                  onChange(dateToIso(d));
                  setOpen(false);
                }
              }}
              month={month}
              onMonthChange={setMonth}
              locale={ptBR}
              captionLayout="dropdown"
              navLayout="around"
              startMonth={
                disablePast ? today : new Date(rangeStartYear, 0, 1)
              }
              endMonth={new Date(rangeEndYear, 11, 31)}
              disabled={disabledDays.length > 0 ? disabledDays : undefined}
              showOutsideDays
              fixedWeeks
              components={{
                Dropdown: DayPickerAppDropdown,
              }}
              classNames={{
                root: "rdp-root w-full max-w-full p-0 font-sans text-[14px] text-[var(--ds-text-body)]",
                months: "w-full max-w-full",
                month:
                  "rdp-month settings-date-picker-rdp__month w-full max-w-full gap-0 px-1 pb-2",
                month_caption:
                  "rdp-month_caption settings-date-picker-rdp__caption",
                dropdowns:
                  "flex w-full max-w-full flex-nowrap items-center justify-center gap-2",
                dropdown_root:
                  "relative flex min-h-[42px] flex-1 basis-0 items-stretch rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-input)] transition-colors hover:bg-[var(--ds-bg-muted)]",
                dropdown:
                  "flex h-[42px] w-full min-w-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[var(--ds-text-body)] outline-none",
                caption_label:
                  "relative z-[1] flex h-[42px] w-full items-center justify-center gap-1.5 px-2 text-[14px] font-semibold text-[var(--ds-text-primary)] pointer-events-none",
                months_dropdown:
                  "font-sans text-[14px] font-semibold text-[var(--ds-text-body)]",
                years_dropdown:
                  "font-sans text-[14px] font-semibold text-[var(--ds-text-body)]",
                button_previous: "settings-date-picker-rdp__nav-btn",
                button_next: "settings-date-picker-rdp__nav-btn",
                weekdays: "px-1 pt-2",
                weekday: lowercaseLabel
                  ? "text-[10px] font-semibold lowercase tracking-wide text-[var(--ds-text-muted)]"
                  : "text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]",
                weeks: "mt-1",
                day: "p-0.5 text-center",
                day_button:
                  "mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-[13px] font-semibold text-[var(--ds-text-body)] transition hover:border-accent/30 hover:bg-accent/10",
                outside: "opacity-35",
                disabled: "opacity-30",
              }}
              modifiersClassNames={{
                selected:
                  "[&_.rdp-day_button]:border-accent [&_.rdp-day_button]:bg-accent [&_.rdp-day_button]:text-white",
                today:
                  "[&_.rdp-day_button]:border-accent/35 [&_.rdp-day_button]:text-accent",
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
