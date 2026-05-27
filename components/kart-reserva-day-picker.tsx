"use client";

import * as React from "react";
import {
  DayPicker,
  UI,
  useDayPicker,
  type DropdownProps,
} from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { startOfToday } from "date-fns";
import "react-day-picker/style.css";

import { AppDropdown } from "@/components/ui/app-dropdown";

type Props = {
  selected: Date;
  onSelect: (date: Date) => void;
  month: Date;
  onMonthChange: (date: Date) => void;
};

function fireSelectChange(
  onChange: DropdownProps["onChange"],
  nextValue: number,
) {
  if (!onChange) return;
  const v = String(nextValue);
  const target = { value: v } as EventTarget & { value: string };
  onChange({
    target,
    currentTarget: target,
  } as React.ChangeEvent<HTMLSelectElement>);
}

function rdpNumericValue(
  value: DropdownProps["value"],
): number | undefined {
  if (value === undefined || value === "") return undefined;
  return typeof value === "string" ? Number(value) : (value as number);
}

/** Integra o `AppDropdown` ao contrato do react-day-picker (`Dropdown`). */
export function DayPickerAppDropdown(props: DropdownProps) {
  const { options, className, disabled, onChange, value, style } = props;
  const { classNames, components } = useDayPicker();
  const Chevron = components.Chevron;

  const numericValue = rdpNumericValue(value);
  const listOptions =
    options?.map((o) => ({
      value: o.value,
      label: o.label,
      disabled: o.disabled,
    })) ?? [];

  return (
    <AppDropdown<number>
      options={listOptions}
      value={numericValue}
      onSelect={(v) => fireSelectChange(onChange, v)}
      disabled={disabled}
      aria-label={props["aria-label"]}
      rootClassName={classNames[UI.DropdownRoot]}
      triggerClassName={[classNames[UI.Dropdown], className]
        .filter(Boolean)
        .join(" ")}
      labelClassName={classNames[UI.CaptionLabel]}
      chevron={
        <Chevron orientation="down" size={18} className={classNames[UI.Chevron]} />
      }
      style={style}
    />
  );
}

export function KartReservaDayPicker({
  selected,
  onSelect,
  month,
  onMonthChange,
}: Props) {
  const today = startOfToday();
  const y = today.getFullYear();

  return (
    <div className="kart-reserva-rdp w-full overflow-x-hidden overflow-y-visible rounded-xl bg-background dark:bg-[#080808]">
      <DayPicker
        mode="single"
        required
        selected={selected}
        onSelect={(d) => {
          if (d) onSelect(d);
        }}
        month={month}
        onMonthChange={onMonthChange}
        locale={ptBR}
        captionLayout="dropdown"
        navLayout="around"
        startMonth={today}
        endMonth={new Date(y + 2, 11, 31)}
        disabled={[{ before: today }, (date) => date.getDay() === 1]}
        showOutsideDays
        fixedWeeks
        components={{
          Dropdown: DayPickerAppDropdown,
        }}
        classNames={{
          root: "rdp-root w-full max-w-full p-0 font-sans text-[15px] text-primary",
          months: "w-full max-w-full",
          month:
            "rdp-month kart-reserva-rdp__month w-full max-w-full gap-0 px-1 pb-3 sm:px-2",
          month_caption: "rdp-month_caption kart-reserva-rdp__caption",
          dropdowns:
            "flex w-full max-w-full flex-nowrap items-center justify-center gap-2",
          dropdown_root:
            "relative flex min-h-[42px] flex-1 basis-0 items-stretch rounded-xl border-2 border-divider bg-background dark:bg-[#080808]",
          dropdown:
            "flex h-[42px] w-full min-w-0 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-transparent p-0 text-primary outline-none transition hover:bg-[rgba(13,31,60,0.05)] dark:hover:bg-white/[0.05]",
          caption_label:
            "relative z-[1] flex h-[42px] w-full items-center justify-center gap-1.5 px-2 text-[14px] font-semibold text-primary pointer-events-none",
          months_dropdown:
            "app-dropdown__trigger font-sans text-[14px] font-semibold",
          years_dropdown:
            "app-dropdown__trigger font-sans text-[14px] font-semibold",
          button_previous: "kart-reserva-rdp__nav-btn",
          button_next: "kart-reserva-rdp__nav-btn",
          weekdays: "px-1 pt-2",
          weekday:
            "text-[11px] font-bold uppercase tracking-wider text-foreground opacity-100",
          weeks: "mt-1",
          day: "p-0.5 text-center",
          day_button:
            "mx-auto flex h-10 w-10 max-w-full items-center justify-center rounded-xl border-2 border-transparent text-[14px] font-semibold transition hover:border-[rgba(13,31,60,0.35)] hover:bg-[rgba(13,31,60,0.07)] dark:hover:border-white/20 dark:hover:bg-white/[0.07]",
          outside: "opacity-40",
          disabled: "opacity-35",
          hidden: "invisible",
        }}
      />
    </div>
  );
}
