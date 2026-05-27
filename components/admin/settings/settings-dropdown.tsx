"use client";

import { HiOutlineChevronDown } from "react-icons/hi2";
import {
  AppDropdown,
  type AppDropdownOption,
} from "@/components/ui/app-dropdown";
import { settingsFieldClass } from "./settings-section";

const dropdownRootClass = `relative block w-full min-w-0 h-12 min-h-12 ${settingsFieldClass} focus-within:bg-white`;

const dropdownTriggerClass =
  "flex h-full min-h-12 w-full min-w-0 cursor-pointer items-center rounded-xl border-0 bg-transparent px-4 py-0 text-left outline-none transition enabled:hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-50";

const dropdownLabelClass =
  "flex w-full items-center justify-between gap-2 text-[14px] text-[#111]";

const dropdownListClass =
  "z-[200] !border !border-[rgba(17,17,17,0.1)] !bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]";

const dropdownOptionClass =
  "!font-normal !text-[#111] hover:!bg-[#fafbfc]";

type Props = {
  options: AppDropdownOption<string>[];
  value: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
  listClassName?: string;
};

export function SettingsDropdown({
  options,
  value,
  onSelect,
  disabled,
  "aria-label": ariaLabel,
  id,
  listClassName,
}: Props) {
  const resolvedValue = options.some((o) => o.value === value)
    ? value
    : (options[0]?.value ?? "");

  return (
    <AppDropdown
      id={id}
      options={options}
      value={resolvedValue}
      onSelect={onSelect}
      disabled={disabled}
      aria-label={ariaLabel}
      rootClassName={dropdownRootClass}
      triggerClassName={dropdownTriggerClass}
      labelClassName={dropdownLabelClass}
      listClassName={[dropdownListClass, listClassName].filter(Boolean).join(" ")}
      optionClassName={dropdownOptionClass}
      chevron={
        <HiOutlineChevronDown
          className="h-[18px] w-[18px] shrink-0 text-neutral-500"
          aria-hidden
        />
      }
    />
  );
}
