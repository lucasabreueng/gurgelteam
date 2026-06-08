"use client";

import type { InventoryCategory } from "@/lib/contracts/inventory";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
  DrawerFooterActions,
} from "@/components/ui/drawer-footer";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import Image from "next/image";
import { HiXMark } from "react-icons/hi2";

import { generatePartCode } from "@/lib/inventory-parts-store";
import {
  useInventoryPartById,
  useInventoryPartMutations,
} from "./use-inventory-parts";
import { useInventorySuppliers } from "./use-inventory-suppliers";
import { SettingsDropdown } from "../settings/settings-dropdown";
import {
  formatUnitCostBlur,
  parsePositiveInt,
  parseUnitCost,
  sanitizePositiveIntInput,
  sanitizeUnitCostInput,
} from "./inventory-form-utils";

const inputClass =
  "w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm";

type Props = {
  open: boolean;
  partId?: string | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
};

export function PartFormDrawer({
  open,
  partId,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = Boolean(partId);
  const existing = useInventoryPartById(partId);
  const suppliers = useInventorySuppliers();
  const { createMutation, updateMutation } = useInventoryPartMutations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  useDrawerBodyLock(open);


  const [name, setName] = useState("");
  const [category, setCategory] = useState<InventoryCategory | "">("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (existing) {
      setName(existing.name);
      setCategory(existing.category);
      setStock(String(existing.stock));
      setMinStock(String(existing.minStock));
      setUnitCost(formatUnitCostBlur(String(existing.unitCost)));
      setImagePreview(existing.image ?? null);
      setImageRemoved(false);
    } else {
      setName("");
      setCategory("");
      setStock("");
      setMinStock("");
      setUnitCost("");
      setImagePreview(null);
      setImageRemoved(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, partId, existing]);

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
    if (!category) return "—";
    return generatePartCode(category);
  }, [isEdit, existing, category]);

  const categoryOptions = [
    { value: "", label: "Categoria" },
    ...InventoryServiceMock.getCategories().map((c) => ({ value: c, label: c })),
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setImageRemoved(false);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resolveImagePayload = (): string | null | undefined => {
    if (imageRemoved && !imagePreview) return null;
    if (imagePreview) return imagePreview;
    if (isEdit) return undefined;
    return undefined;
  };

  const handleSubmit = async () => {
    if (!name.trim() || !category) {
      onSuccess("Preencha descrição e categoria.");
      return;
    }
    const stockNum = parsePositiveInt(stock);
    const minStockNum = parsePositiveInt(minStock);
    const costNum = parseUnitCost(unitCost);
    if (stockNum === null || minStockNum === null || costNum === null) {
      onSuccess(
        "Estoque e estoque mínimo devem ser inteiros positivos. Custo unitário inválido.",
      );
      return;
    }

    const payload = {
      name,
      category,
      stock: stockNum,
      minStock: minStockNum,
      unitCost: costNum,
      image: resolveImagePayload(),
    };

    try {
      if (isEdit && partId) {
        const updated = await updateMutation.mutateAsync({ id: partId, input: payload });
        if (!updated) {
          onSuccess("Peça não encontrada.");
          return;
        }
        onSuccess(`Peça ${updated.name} atualizada.`);
      } else {
        const supplierId = existing?.supplierId ?? suppliers[0]?.id;
        if (!supplierId) {
          onSuccess("Cadastre um fornecedor antes de incluir peças.");
          return;
        }
        const created = await createMutation.mutateAsync({
          ...payload,
          supplierId,
          image: imagePreview ?? undefined,
        });
        if (!created) {
          onSuccess("Não foi possível cadastrar a peça.");
          return;
        }
        onSuccess(`Peça ${created.name} cadastrada (${created.code}).`);
      }
      onClose();
    } catch {
      onSuccess("Erro ao salvar peça. Tente novamente.");
    }
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
        className="app-drawer-panel relative flex h-full w-full max-w-[min(100vw,480px)] flex-col bg-[var(--ds-bg-panel)] shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-5 py-4">
          <h2 className="text-lg font-bold text-[#0d1f3c]">
            {isEdit ? "Editar peça" : "Cadastrar peça"}
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
            <div className="text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Imagem
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0d1f3c] file:px-3 file:py-2 file:text-[11px] file:font-bold file:uppercase file:text-white"
              />
              {imagePreview ? (
                <div className="relative mt-3">
                  <div className="relative h-36 overflow-hidden rounded-2xl">
                    <Image
                      src={imagePreview}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="480px"
                      unoptimized={imagePreview.startsWith("blob:")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="mt-2 text-[11px] font-bold uppercase tracking-wider text-red-700 hover:underline"
                  >
                    Remover imagem
                  </button>
                </div>
              ) : null}
            </div>

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
                Descrição
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da peça"
                className={inputClass}
              />
            </label>

            <div className="text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Categoria
              </span>
              <SettingsDropdown
                aria-label="Categoria"
                options={categoryOptions}
                value={category}
                onSelect={(v) => setCategory(v as InventoryCategory | "")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-[#0d1f3c]">
                  Estoque
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={stock}
                  onChange={(e) =>
                    setStock(sanitizePositiveIntInput(e.target.value))
                  }
                  placeholder="0"
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-[#0d1f3c]">
                  Estoque mínimo
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={minStock}
                  onChange={(e) =>
                    setMinStock(sanitizePositiveIntInput(e.target.value))
                  }
                  placeholder="0"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[#0d1f3c]">
                Custo unitário (R$)
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={unitCost}
                onChange={(e) =>
                  setUnitCost(sanitizeUnitCostInput(e.target.value))
                }
                onBlur={() => setUnitCost(formatUnitCostBlur(unitCost))}
                placeholder="0,00"
                className={inputClass}
              />
              {unitCost && parseUnitCost(unitCost) !== null ? (
                <p className="mt-1 text-xs text-neutral-500">
                  {InventoryServiceMock.formatCurrency(parseUnitCost(unitCost)!)}
                </p>
              ) : null}
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
                {isEdit ? "Salvar alterações" : "Cadastrar peça"}
              </button>
            </DrawerFooterActions>
          </div>
        </footer>
      </aside>
    </div>
  );
}
