"use client";

import * as React from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { usePreferNativeSelect } from "@/lib/hooks/use-prefer-native-select";

/** Opção do dropdown padrão da aplicação (listbox). */
export type AppDropdownOption<T extends string | number = string | number> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type AppDropdownProps<T extends string | number = string | number> = {
  options: AppDropdownOption<T>[];
  value: T | undefined;
  onSelect: (value: T) => void;
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
  /** Wrapper externo (ex.: `rdp-dropdown_root`). */
  rootClassName?: string;
  /** Botão que abre o painel. */
  triggerClassName?: string;
  /** Conteúdo interno do trigger (rótulo + chevron). */
  labelClassName?: string;
  /** Painel da lista (`<ul>`). */
  listClassName?: string;
  /** Classe extra em cada opção (`<button>`). */
  optionClassName?: string;
  /** Substitui o chevron padrão (ex.: ícone do react-day-picker). */
  chevron?: React.ReactNode;
  /** Texto exibido no trigger quando nenhuma opção real está selecionada. */
  placeholder?: string;
  style?: React.CSSProperties;
  /** Altura máxima do painel (Tailwind), padrão `max-h-52`. */
  listMaxHeightClassName?: string;
};

const listBase =
  "app-dropdown__list absolute left-0 right-0 top-full z-[60] mt-2 min-w-0 overflow-y-auto rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-elevated)] py-1 shadow-[var(--ds-shadow-popover)] outline-none app-dropdown-scrollbar";

const triggerBase =
  "app-dropdown__trigger flex w-full min-w-0 cursor-pointer items-center text-left outline-none transition disabled:cursor-not-allowed disabled:opacity-50";

const optionSelectedClass =
  "border border-accent bg-[var(--ds-bg-elevated)] text-[var(--ds-text-primary)]";

const optionBase =
  "app-dropdown__option flex w-full items-center rounded-lg border border-transparent px-2.5 py-2 text-left text-[14px] font-semibold text-[var(--ds-text-body)] transition";

const nativeSelectClass =
  "app-native-select block h-full min-h-12 w-full min-w-0 cursor-pointer appearance-none rounded-xl border-0 bg-transparent px-4 py-0 pr-10 text-left text-[14px] text-[var(--ds-text-body)] outline-none transition disabled:cursor-not-allowed disabled:opacity-50";

type NativeSelectProps<T extends string | number> = Pick<
  AppDropdownProps<T>,
  | "options"
  | "value"
  | "onSelect"
  | "disabled"
  | "aria-label"
  | "id"
  | "rootClassName"
  | "triggerClassName"
  | "chevron"
  | "style"
>;

function AppNativeSelect<T extends string | number = string | number>({
  options,
  value,
  onSelect,
  disabled,
  "aria-label": ariaLabel,
  id,
  rootClassName,
  triggerClassName,
  chevron,
  style,
}: NativeSelectProps<T>) {
  const stringValue =
    value === "" || value === undefined || value === null ? "" : String(value);
  const resolvedValue = options.some((o) => String(o.value) === stringValue)
    ? stringValue
    : String(options[0]?.value ?? "");

  return (
    <span className={rootClassName} style={style}>
      <span className="relative block h-full w-full min-w-0">
        <select
          id={id}
          disabled={disabled}
          aria-label={ariaLabel}
          value={resolvedValue}
          onChange={(e) => {
            const opt = options.find((o) => String(o.value) === e.target.value);
            if (opt && !opt.disabled) onSelect(opt.value);
          }}
          className={[nativeSelectClass, triggerClassName].filter(Boolean).join(" ")}
        >
          {options.map((opt) => (
            <option
              key={String(opt.value)}
              value={String(opt.value)}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          aria-hidden
        >
          {chevron ?? (
            <HiOutlineChevronDown
              className="h-[18px] w-[18px] shrink-0 text-primary opacity-80"
              aria-hidden
            />
          )}
        </span>
      </span>
    </span>
  );
}

/**
 * Dropdown padrão da aplicação: listbox no desktop; `<select>` nativo no mobile/tablet.
 */
export function AppDropdown<T extends string | number = string | number>({
  options,
  value,
  onSelect,
  disabled,
  "aria-label": ariaLabel,
  id,
  rootClassName,
  triggerClassName,
  labelClassName,
  listClassName,
  optionClassName,
  chevron,
  placeholder,
  style,
  listMaxHeightClassName = "max-h-52",
}: AppDropdownProps<T>) {
  const preferNativeSelect = usePreferNativeSelect();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLSpanElement>(null);

  const emptyOption = options.find((o) => o.value === "");
  const listOptions = options.filter((o) => o.value !== "");
  const selectedOption = options.find((o) => o.value === value);
  const isEmptySelection =
    value === "" || value === undefined || value === null;
  const triggerLabel =
    !isEmptySelection && selectedOption
      ? selectedOption.label
      : (placeholder ?? emptyOption?.label ?? ariaLabel ?? "Selecionar");
  const triggerMuted = isEmptySelection || !selectedOption;

  React.useEffect(() => {
    if (preferNativeSelect || !open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, preferNativeSelect]);

  if (preferNativeSelect) {
    return (
      <AppNativeSelect
        options={options}
        value={value}
        onSelect={onSelect}
        disabled={disabled}
        aria-label={ariaLabel}
        id={id}
        rootClassName={rootClassName}
        triggerClassName={triggerClassName}
        chevron={chevron}
        style={style}
      />
    );
  }

  return (
    <span
      ref={rootRef}
      data-disabled={disabled}
      data-open={open ? "true" : undefined}
      className={rootClassName}
      style={style}
    >
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={[triggerBase, triggerClassName].filter(Boolean).join(" ")}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          if (disabled) return;
          setOpen((o) => !o);
        }}
      >
        <span className={labelClassName}>
          {triggerMuted ? (
            <span className="text-[var(--ds-text-muted)]">{triggerLabel}</span>
          ) : (
            triggerLabel
          )}
          {chevron ?? (
            <HiOutlineChevronDown
              className="h-[18px] w-[18px] shrink-0 text-primary opacity-80"
              aria-hidden
            />
          )}
        </span>
      </button>
      {open && listOptions.length > 0 ? (
        <ul
          role="listbox"
          className={[listBase, listMaxHeightClassName, listClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {listOptions.map((opt) => {
            const isActive = opt.value === value;
            return (
              <li key={String(opt.value)} role="presentation" className="px-0.5">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  disabled={opt.disabled}
                  className={
                    `${optionBase} ${optionClassName ?? ""} ` +
                    (opt.disabled
                      ? "cursor-not-allowed opacity-40"
                      : "hover:bg-[var(--ds-bg-muted)]") +
                    (isActive ? ` ${optionSelectedClass}` : "")
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (opt.disabled) return;
                    onSelect(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </span>
  );
}
