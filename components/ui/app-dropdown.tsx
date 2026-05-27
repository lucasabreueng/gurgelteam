"use client";

import * as React from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

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
  "app-dropdown__list absolute left-0 right-0 top-[calc(100%+4px)] z-[60] min-w-0 overflow-y-auto rounded-xl border-2 border-divider bg-background py-1 shadow-lg outline-none dark:bg-[#080808] app-dropdown-scrollbar";

const triggerBase =
  "app-dropdown__trigger flex w-full min-w-0 cursor-pointer items-center text-left outline-none transition disabled:cursor-not-allowed disabled:opacity-50";

const optionBase =
  "app-dropdown__option flex w-full items-center rounded-lg px-2.5 py-2 text-left text-[14px] font-semibold text-primary transition";

/**
 * Dropdown padrão da aplicação: botão + listbox (sem `<select>` nativo).
 * Use este componente para qualquer lista suspensa com o mesmo visual.
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
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    // Evita fechar no mesmo clique que abriu o painel.
    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span
      ref={rootRef}
      data-disabled={disabled}
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
            <span className="text-neutral-400">{triggerLabel}</span>
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
                      : "hover:bg-[rgba(13,31,60,0.08)] dark:hover:bg-white/[0.08]") +
                    (isActive
                      ? " bg-[rgba(13,31,60,0.12)] text-[var(--color-accent)] dark:bg-white/[0.1]"
                      : "")
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
