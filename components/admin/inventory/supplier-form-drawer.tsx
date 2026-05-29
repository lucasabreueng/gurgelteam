"use client";

import type { SupplierStatus } from "@/lib/contracts/inventory";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { useEffect, useMemo, useState } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { HiXMark } from "react-icons/hi2";

import {
  addInventorySupplier,
  generateSupplierCode,
  getInventorySupplierById,
  updateInventorySupplier,
} from "@/lib/inventory-suppliers-store";
import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
  DrawerFooterActions,
} from "@/components/ui/drawer-footer";
import { SettingsDropdown } from "../settings/settings-dropdown";

const inputClass =
  "w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm";

const STATUS_OPTIONS = (
  Object.entries(InventoryServiceMock.getSupplierStatusLabels()) as [SupplierStatus, string][]
).map(([value, label]) => ({ value, label }));

const emptyForm = {
  name: "",
  cnpj: "",
  city: "",
  phone: "",
  whatsapp: "",
  email: "",
  status: "ativo" as SupplierStatus,
  avgLeadDays: "",
  partsSupplied: "",
};

type Props = {
  open: boolean;
  supplierId?: string | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
};

export function SupplierFormDrawer({
  open,
  supplierId,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = Boolean(supplierId);
  const existing = supplierId ? getInventorySupplierById(supplierId) : null;
  useDrawerBodyLock(open);


  const [name, setName] = useState(emptyForm.name);
  const [cnpj, setCnpj] = useState(emptyForm.cnpj);
  const [city, setCity] = useState(emptyForm.city);
  const [phone, setPhone] = useState(emptyForm.phone);
  const [whatsapp, setWhatsapp] = useState(emptyForm.whatsapp);
  const [email, setEmail] = useState(emptyForm.email);
  const [status, setStatus] = useState<SupplierStatus>(emptyForm.status);
  const [avgLeadDays, setAvgLeadDays] = useState(emptyForm.avgLeadDays);
  const [partsSupplied, setPartsSupplied] = useState(emptyForm.partsSupplied);

  useEffect(() => {
    if (!open) return;
    if (existing) {
      setName(existing.name);
      setCnpj(existing.cnpj);
      setCity(existing.city);
      setPhone(existing.phone);
      setWhatsapp(existing.whatsapp);
      setEmail(existing.email ?? "");
      setStatus(existing.status);
      setAvgLeadDays(String(existing.avgLeadDays));
      setPartsSupplied(existing.partsSupplied.join(", "));
    } else {
      setName(emptyForm.name);
      setCnpj(emptyForm.cnpj);
      setCity(emptyForm.city);
      setPhone(emptyForm.phone);
      setWhatsapp(emptyForm.whatsapp);
      setEmail(emptyForm.email);
      setStatus(emptyForm.status);
      setAvgLeadDays(emptyForm.avgLeadDays);
      setPartsSupplied(emptyForm.partsSupplied);
    }
  }, [open, supplierId, existing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      };
  }, [open, onClose]);

  const previewCode = useMemo(() => {
    if (isEdit && existing) return existing.code;
    if (!name.trim()) return "—";
    return generateSupplierCode(name);
  }, [isEdit, existing, name]);

  const buildInput = () => ({
    name,
    cnpj,
    city,
    phone,
    whatsapp,
    email: email.trim() || undefined,
    status,
    avgLeadDays: Number.parseInt(avgLeadDays, 10),
    partsSupplied: partsSupplied
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean),
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      onSuccess("Preencha o nome do fornecedor.");
      return;
    }
    const lead = Number.parseInt(avgLeadDays, 10);
    if (!Number.isFinite(lead) || lead < 1) {
      onSuccess("Prazo médio inválido.");
      return;
    }

    const input = { ...buildInput(), avgLeadDays: lead };

    if (isEdit && supplierId) {
      const updated = updateInventorySupplier(supplierId, input);
      if (!updated) {
        onSuccess("Fornecedor não encontrado.");
        return;
      }
      onSuccess(`Fornecedor ${updated.name} atualizado.`);
      onClose();
      return;
    }

    const created = addInventorySupplier(input);
    onSuccess(`Fornecedor ${created.name} cadastrado.`);
    onClose();
  };

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
        className="app-drawer-panel relative flex h-full w-full max-w-[min(100vw,480px)] flex-col bg-[#f3f5f9] shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
          <h2 className="text-lg font-bold text-[#0d1f3c]">
            {isEdit ? "Editar fornecedor" : "Cadastrar fornecedor"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)]"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Código
              </span>
              <input
                type="text"
                readOnly
                value={previewCode}
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Nome
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">CNPJ</span>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Cidade
              </span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-[#0d1f3c]">
                  Telefone
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-[#0d1f3c]">
                  WhatsApp
                </span>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                E-mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>
            <div className="text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Status
              </span>
              <SettingsDropdown
                aria-label="Status"
                options={STATUS_OPTIONS}
                value={status}
                onSelect={(v) => setStatus(v as SupplierStatus)}
              />
            </div>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Prazo médio (dias)
              </span>
              <input
                type="number"
                min={1}
                value={avgLeadDays}
                onChange={(e) => setAvgLeadDays(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Peças fornecidas
              </span>
              <input
                type="text"
                value={partsSupplied}
                onChange={(e) => setPartsSupplied(e.target.value)}
                placeholder="Separadas por vírgula"
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <footer className={DRAWER_FOOTER_SHELL_CLASS}>
          <div className={DRAWER_FOOTER_INNER_CLASS}>
            <DrawerFooterActions columns={1}>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary-md"
              >
                {isEdit ? "Salvar alterações" : "Cadastrar fornecedor"}
              </button>
            </DrawerFooterActions>
          </div>
        </footer>
      </aside>
    </div>
  );
}
