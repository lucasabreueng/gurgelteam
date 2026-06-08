"use client";

import { HiOutlineChevronDown } from "react-icons/hi2";
import {
  AppDropdown,
  type AppDropdownOption,
} from "@/components/ui/app-dropdown";
import {
  adminComboFieldShellClass,
  adminComboFieldTriggerClass,
} from "@/lib/design/classes";

const dropdownRootClass = `h-12 min-h-12 ${adminComboFieldShellClass}`;

const dropdownTriggerClass = adminComboFieldTriggerClass;

const dropdownLabelClass =
  "flex w-full items-center justify-between gap-2 text-[14px] text-[var(--ds-text-body)]";

const dropdownListClass =
  "z-[200] !border !border-[var(--ds-border-field)] !bg-[var(--ds-bg-elevated)] !shadow-[var(--ds-shadow-popover)]";

const dropdownOptionClass =
  "!font-normal !text-[var(--ds-text-body)] hover:!bg-[var(--ds-bg-muted)]";

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
          className="h-[18px] w-[18px] shrink-0 text-[var(--ds-text-muted)]"
          aria-hidden
        />
      }
    />
  );
}
