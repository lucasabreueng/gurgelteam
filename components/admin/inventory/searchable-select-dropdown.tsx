"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HiMagnifyingGlass, HiOutlineChevronDown } from "react-icons/hi2";
import { settingsFieldClass } from "../settings/settings-section";

export type SearchableOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onSelect: (value: string) => void;
  options: SearchableOption[];
  emptyLabel: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

const rootClass = `relative block w-full min-w-0 h-12 min-h-12 ${settingsFieldClass} focus-within:bg-white`;

const triggerClass =
  "flex h-full min-h-12 w-full min-w-0 cursor-pointer items-center rounded-xl border-0 bg-transparent px-4 py-0 text-left outline-none transition enabled:hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-50";

const labelClass =
  "flex w-full items-center justify-between gap-2 text-[14px] text-[#111]";

const listClass =
  "app-dropdown__list absolute left-0 right-0 top-[calc(100%+4px)] z-[200] max-h-60 min-w-0 overflow-hidden rounded-xl border-2 border-[rgba(17,17,17,0.1)] bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)] app-dropdown-scrollbar";

const optionClass =
  "!font-normal !text-[#111] hover:!bg-[#fafbfc]";

export function SearchableSelectDropdown({
  value,
  onSelect,
  options,
  emptyLabel,
  searchPlaceholder = "Buscar…",
  disabled,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const timer = window.setTimeout(() => searchRef.current?.focus(), 0);
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span ref={rootRef} data-disabled={disabled} className={rootClass}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ?? emptyLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => !disabled && setOpen((v) => !v)}
        className={triggerClass}
      >
        <span className={labelClass}>
          <span className="min-w-0 truncate">
            {selected?.label ?? emptyLabel}
          </span>
          <HiOutlineChevronDown
            className={`h-[18px] w-[18px] shrink-0 text-neutral-500 transition ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </span>
      </button>

      {open ? (
        <div className={listClass} role="listbox">
          <div className="border-b border-[rgba(17,17,17,0.08)] p-2">
            <div className="relative">
              <HiMagnifyingGlass
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0d1f3c]/30"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <ul className="max-h-44 overflow-y-auto app-dropdown-scrollbar">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-neutral-500">
                Nenhum resultado.
              </li>
            ) : (
              filtered.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === o.value}
                    className={`app-dropdown__option w-full px-4 py-2.5 text-left text-sm ${optionClass} ${
                      value === o.value ? "!bg-[#fafbfc] font-semibold" : ""
                    }`}
                    onClick={() => {
                      onSelect(o.value);
                      setOpen(false);
                    }}
                  >
                    {o.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </span>
  );
}
