"use client";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { useEffect, useMemo, useState } from "react";
import { HiXMark } from "react-icons/hi2";

import { getInventoryParts } from "@/lib/inventory-parts-store";
import { SettingsDropdown } from "../settings/settings-dropdown";
import {
  INVENTORY_KART_OPTIONS,
  OsSearchDropdown,
} from "./os-search-dropdown";
import { PartSearchDropdown } from "./part-search-dropdown";
import { SearchableSelectDropdown } from "./searchable-select-dropdown";
import { useInventoryParts } from "./use-inventory-parts";

function useDrawerLock(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
}

const inputClass =
  "w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm";

type DrawerShellProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel: string;
};

function DrawerShell({
  open,
  title,
  onClose,
  children,
  onSubmit,
  submitLabel,
}: DrawerShellProps) {
  useDrawerLock(open, onClose);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[228] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="relative flex h-full w-full max-w-[min(100vw,480px)] flex-col bg-[#f3f5f9] shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
          <h2 className="text-lg font-bold text-[#0d1f3c]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)]"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
          <button type="button" onClick={onSubmit} className="btn-primary-md w-full">
            {submitLabel}
          </button>
        </footer>
      </aside>
    </div>
  );
}

type EntryExitProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  mode: "entry" | "exit";
};

export function InventoryEntryDrawer({
  open,
  onClose,
  onSuccess,
}: Omit<EntryExitProps, "mode">) {
  const parts = useInventoryParts();
  const [partId, setPartId] = useState("");
  const [qty, setQty] = useState("1");
  const [nfRef, setNfRef] = useState("");

  useEffect(() => {
    if (open && parts[0] && !partId) {
      setPartId(parts[0].id);
    }
  }, [open, parts, partId]);

  return (
    <DrawerShell
      open={open}
      title="Registrar entrada"
      onClose={onClose}
      submitLabel="Confirmar entrada"
      onSubmit={() => {
        const parts = getInventoryParts();
        const part = parts.find((p) => p.id === partId);
        const nfLabel =
          InventoryServiceMock.getNfReferences().find((n) => n.value === nfRef)?.label ?? nfRef;
        onSuccess(
          `Entrada registrada: ${qty} un. de ${part?.name ?? "peça"} · ${nfLabel || "sem NF"} (mock). Estoque atualizado.`,
        );
        onClose();
      }}
    >
      <div className="space-y-4">
        <div className="text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">Peça</span>
          <PartSearchDropdown
            value={partId}
            onSelect={setPartId}
            disabled={parts.length === 0}
          />
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">
            Quantidade
          </span>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className={inputClass}
          />
        </label>
        <div className="text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">
            NF / Referência
          </span>
          <SearchableSelectDropdown
            value={nfRef}
            onSelect={setNfRef}
            options={InventoryServiceMock.getNfReferences()}
            emptyLabel="NF / Referência"
            searchPlaceholder="Buscar NF ou referência…"
            aria-label="NF / Referência"
          />
        </div>
      </div>
    </DrawerShell>
  );
}

const kartDropdownOptions = [
  { value: "", label: "Kart" },
  ...INVENTORY_KART_OPTIONS,
];

export function InventoryExitDrawer({
  open,
  onClose,
  onSuccess,
}: Omit<EntryExitProps, "mode">) {
  const parts = useInventoryParts();
  const [partId, setPartId] = useState("");
  const [qty, setQty] = useState("1");
  const [os, setOs] = useState("");
  const [kart, setKart] = useState("");

  useEffect(() => {
    if (open && parts[0] && !partId) {
      setPartId(parts[0].id);
    }
  }, [open, parts, partId]);

  return (
    <DrawerShell
      open={open}
      title="Registrar saída"
      onClose={onClose}
      submitLabel="Confirmar saída"
      onSubmit={() => {
        const parts = getInventoryParts();
        const part = parts.find((p) => p.id === partId);
        const kartLabel = kart
          ? `Kart ${String(kart).padStart(2, "0")}`
          : "—";
        onSuccess(
          `Saída registrada: ${qty} un. de ${part?.name ?? "peça"} · ${kartLabel} · ${os || "—"}. Estoque baixado (mock).`,
        );
        onClose();
      }}
    >
      <div className="space-y-4">
        <div className="text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">Peça</span>
          <PartSearchDropdown
            value={partId}
            onSelect={setPartId}
            disabled={parts.length === 0}
          />
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">
            Quantidade
          </span>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className={inputClass}
          />
        </label>
        <div className="text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">
            OS vinculada
          </span>
          <OsSearchDropdown
            value={os}
            onSelect={(osNumber, kartNumber) => {
              setOs(osNumber);
              if (kartNumber) setKart(String(kartNumber));
            }}
          />
        </div>
        <div className="text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">Kart</span>
          <SettingsDropdown
            aria-label="Kart"
            options={kartDropdownOptions}
            value={kart}
            onSelect={setKart}
          />
        </div>
      </div>
    </DrawerShell>
  );
}

export function InventoryPurchaseDrawer({
  open,
  onClose,
  onSuccess,
  prefillPart,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  prefillPart?: string;
}) {
  const parts = useInventoryParts();
  const [partId, setPartId] = useState("");
  const [supplierId, setSupplierId] = useState(
    InventoryServiceMock.getStaticSuppliers()[0]?.id ?? "",
  );

  const supplierOptions = useMemo(
    () =>
      InventoryServiceMock.getStaticSuppliers().map((s) => ({
        value: s.id,
        label: s.name,
      })),
    [],
  );

  useEffect(() => {
    if (!open) return;
    if (prefillPart) {
      const list = getInventoryParts();
      const match = list.find((p) => p.name.includes(prefillPart));
      if (match) setPartId(match.id);
    } else if (parts[0]) {
      setPartId(parts[0].id);
    }
  }, [prefillPart, open, parts]);

  return (
    <DrawerShell
      open={open}
      title="Solicitar compra"
      onClose={onClose}
      submitLabel="Enviar solicitação"
      onSubmit={() => {
        const parts = getInventoryParts();
        const part = parts.find((p) => p.id === partId);
        onSuccess(`Compra solicitada: ${part?.name ?? "peça"} (mock).`);
        onClose();
      }}
    >
      <div className="space-y-4">
        <div className="text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">Peça</span>
          <PartSearchDropdown value={partId} onSelect={setPartId} />
        </div>
        <div className="text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">
            Fornecedor
          </span>
          <SettingsDropdown
            aria-label="Fornecedor"
            options={
              supplierOptions.length > 0
                ? supplierOptions
                : [{ value: "", label: "Fornecedor" }]
            }
            value={supplierId}
            onSelect={setSupplierId}
          />
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">
            Quantidade
          </span>
          <input type="number" min={1} defaultValue={5} className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-[#0d1f3c]">
            Observações
          </span>
          <textarea
            rows={3}
            className={inputClass}
            placeholder="Urgência, prazo..."
          />
        </label>
      </div>
    </DrawerShell>
  );
}

