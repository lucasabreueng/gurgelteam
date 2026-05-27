"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HiOutlineCalendar, HiOutlineChevronDown } from "react-icons/hi2";
import "react-day-picker/style.css";
import { DayPickerAppDropdown } from "@/components/kart-reserva-day-picker";
import { settingsFieldClass } from "./settings-section";

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
  /** Exibe o rótulo/placeholder em minúsculas (ex.: data de nascimento) */
  lowercaseLabel?: boolean;
  /** Texto quando nenhuma data está selecionada */
  placeholder?: string;
};

function isoToDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const d = parseISO(iso);
  return isValid(d) ? d : undefined;
}

function dateToIso(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/** Seletor de data com calendário (layout mês/ano central, nav nas extremidades). */
export function SettingsDatePicker({
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
  fromYear,
  toYear,
  disableFuture = false,
  lowercaseLabel = false,
  placeholder = "Selecionar data",
}: Props) {
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
    if (!open) return;
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
  }, [open]);

  const displayLabel = selected
    ? format(selected, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : placeholder;
  const labelText = lowercaseLabel
    ? displayLabel.toLocaleLowerCase("pt-BR")
    : displayLabel;

  return (
    <div
      ref={rootRef}
      className={`relative block w-full min-w-0 ${settingsFieldClass} focus-within:bg-white`}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left outline-none transition enabled:hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpen((o) => !o);
        }}
      >
        <span
          className={`flex min-w-0 items-center gap-2.5 text-[14px] text-[#111] ${
            lowercaseLabel ? "" : "capitalize"
          }`}
        >
          <HiOutlineCalendar
            className="h-5 w-5 shrink-0 text-neutral-500"
            aria-hidden
          />
          <span className="truncate">{labelText}</span>
        </span>
        <HiOutlineChevronDown
          className={`h-5 w-5 shrink-0 text-neutral-500 transition ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="dialog"
          className="settings-date-picker-popover absolute left-0 right-0 top-[calc(100%+4px)] z-[200] min-w-[280px] rounded-xl border border-[rgba(17,17,17,0.1)] bg-white p-3 shadow-[0_4px_20px_rgba(13,31,60,0.08)] sm:left-0 sm:right-auto sm:min-w-[320px]"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="settings-date-picker-rdp w-full [--rdp-accent-color:#0d1f3c] [--rdp-nav_button-color:#0d1f3c]">
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
              startMonth={new Date(rangeStartYear, 0, 1)}
              endMonth={new Date(rangeEndYear, 11, 31)}
              disabled={disableFuture ? { after: new Date() } : undefined}
              showOutsideDays
              fixedWeeks
              components={{
                Dropdown: DayPickerAppDropdown,
              }}
              classNames={{
                root: "rdp-root w-full max-w-full p-0 font-sans text-[14px] text-[#111]",
                months: "w-full max-w-full",
                month:
                  "rdp-month settings-date-picker-rdp__month w-full max-w-full gap-0 px-1 pb-2",
                month_caption:
                  "rdp-month_caption settings-date-picker-rdp__caption",
                dropdowns:
                  "flex w-full max-w-full flex-nowrap items-center justify-center gap-2",
                dropdown_root:
                  "relative flex min-h-[42px] flex-1 basis-0 items-stretch rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc]",
                dropdown:
                  "flex h-[42px] w-full min-w-0 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-transparent p-0 text-[#111] outline-none transition hover:bg-white",
                caption_label:
                  "relative z-[1] flex h-[42px] w-full items-center justify-center gap-1.5 px-2 text-[14px] font-semibold text-[#0d1f3c] pointer-events-none",
                months_dropdown:
                  "font-sans text-[14px] font-semibold text-[#111]",
                years_dropdown:
                  "font-sans text-[14px] font-semibold text-[#111]",
                button_previous: "settings-date-picker-rdp__nav-btn",
                button_next: "settings-date-picker-rdp__nav-btn",
                weekdays: "px-1 pt-2",
                weekday:
                  "text-[10px] font-bold uppercase tracking-wider text-neutral-500",
                weeks: "mt-1",
                day: "p-0.5 text-center",
                day_button:
                  "mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-[13px] font-semibold text-[#111] transition hover:border-[rgba(13,31,60,0.2)] hover:bg-[rgba(13,31,60,0.06)]",
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
