"use client";

import { InventoryCatalogRepositoryMock } from "@/repositories/inventory/InventoryCatalogRepositoryMock";

import { useEffect, useMemo, useRef, useState } from "react";
import { HiMagnifyingGlass, HiOutlineChevronDown } from "react-icons/hi2";


import { settingsFieldClass } from "../settings/settings-section";

export type OsOption = {
  osNumber: string;
  kartNumber: number;
  label: string;
};

const OS_OPTIONS: OsOption[] = (() => {
  const map = new Map<string, OsOption>();
  for (const m of InventoryCatalogRepositoryMock.getMovements()) {
    if (!m.osNumber || map.has(m.osNumber)) continue;
    map.set(m.osNumber, {
      osNumber: m.osNumber,
      kartNumber: m.kartNumber ?? 0,
      label: m.kartNumber
        ? `${m.osNumber} · Kart ${String(m.kartNumber).padStart(2, "0")}`
        : m.osNumber,
    });
  }
  return [...map.values()].sort((a, b) =>
    a.osNumber.localeCompare(b.osNumber),
  );
})();

type Props = {
  value: string;
  onSelect: (osNumber: string, kartNumber?: number) => void;
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

export function OsSearchDropdown({
  value,
  onSelect,
  disabled,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = OS_OPTIONS.find((o) => o.osNumber === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OS_OPTIONS;
    return OS_OPTIONS.filter(
      (o) =>
        o.osNumber.toLowerCase().includes(q) ||
        o.label.toLowerCase().includes(q),
    );
  }, [query]);

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
        aria-label={ariaLabel ?? "OS vinculada"}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => !disabled && setOpen((v) => !v)}
        className={triggerClass}
      >
        <span className={labelClass}>
          <span className="min-w-0 truncate">
            {selected?.label ?? "OS vinculada"}
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
                placeholder="Buscar OS…"
                className="w-full rounded-lg border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0d1f3c]/30"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <ul className="max-h-44 overflow-y-auto app-dropdown-scrollbar">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-neutral-500">
                Nenhuma OS encontrada.
              </li>
            ) : (
              filtered.map((o) => (
                <li key={o.osNumber}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === o.osNumber}
                    className={`app-dropdown__option w-full px-4 py-2.5 text-left text-sm ${optionClass} ${
                      value === o.osNumber ? "!bg-[#fafbfc] font-semibold" : ""
                    }`}
                    onClick={() => {
                      onSelect(o.osNumber, o.kartNumber || undefined);
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

export const INVENTORY_KART_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1).map(
  (n) => ({
    value: String(n),
    label: `Kart ${String(n).padStart(2, "0")}`,
  }),
);
