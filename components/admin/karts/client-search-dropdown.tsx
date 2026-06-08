"use client";

import { useClientsList } from "@/lib/query/hooks/use-clients";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiMagnifyingGlass, HiOutlineChevronDown } from "react-icons/hi2";

import { settingsFieldClass } from "../settings/settings-section";

type Props = {
  value: string;
  onSelect: (value: string) => void;
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

export function ClientSearchDropdown({
  value,
  onSelect,
  disabled,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: clients = [] } = useClientsList();

  const selectedClient = clients.find((client) => client.id === value);

  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((client) =>
      client.name.toLowerCase().includes(q)
    );
  }, [query, clients]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const timer = window.setTimeout(() => searchRef.current?.focus(), 0);

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
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
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={triggerClass}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          if (disabled) return;
          setOpen((current) => !current);
        }}
      >
        <span className={labelClass}>
          {selectedClient ? (
            selectedClient.name
          ) : (
            <span className="text-neutral-400">Selecione o cliente…</span>
          )}
          <HiOutlineChevronDown
            className="h-[18px] w-[18px] shrink-0 text-[#111] opacity-80"
            aria-hidden
          />
        </span>
      </button>

      {open ? (
        <div className={listClass} role="presentation">
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
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar cliente…"
                className="h-10 w-full rounded-lg border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] pl-9 pr-3 text-sm text-[#111] outline-none transition focus:border-accent/40 focus:bg-white"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
              />
            </div>
          </div>

          <ul role="listbox" className="max-h-44 overflow-y-auto py-1">
            {filteredClients.length === 0 ? (
              <li className="px-3 py-3 text-sm text-neutral-500">
                Nenhum cliente encontrado.
              </li>
            ) : (
              filteredClients.map((client) => {
                const isActive = client.id === value;
                return (
                  <li key={client.id} role="presentation" className="px-0.5">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={`flex w-full rounded-lg px-2.5 py-2 text-left text-[14px] transition ${optionClass} ${
                        isActive
                          ? "bg-[rgba(13,31,60,0.12)] text-[var(--color-accent)]"
                          : ""
                      }`}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(client.id);
                        setOpen(false);
                      }}
                    >
                      {client.name}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </span>
  );
}
