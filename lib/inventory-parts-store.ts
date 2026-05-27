"use client";

import {
  INVENTORY_PARTS,
  type InventoryCategory,
  type InventoryPart,
} from "@/lib/admin-inventory-mocks";
import type { StockLevel } from "@/lib/admin-parts-mocks";

const CATEGORY_CODE_PREFIX: Record<InventoryCategory, string> = {
  Motor: "MOT",
  Pneus: "PNM",
  Freio: "FRN",
  Transmissão: "TRN",
  Combustível: "CBT",
  Segurança: "SEG",
  Ferramentas: "FER",
  Elétrica: "ELT",
};

let parts: InventoryPart[] = [...INVENTORY_PARTS];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeInventoryParts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getInventoryParts(): InventoryPart[] {
  return parts;
}

export function computeStockLevel(stock: number, minStock: number): StockLevel {
  if (stock <= 0 || stock < minStock * 0.5) return "critical";
  if (stock < minStock) return "low";
  return "ok";
}

export function generatePartCode(category: InventoryCategory): string {
  const prefix = CATEGORY_CODE_PREFIX[category];
  const sameCategory = parts.filter((p) => p.category === category);
  const maxSeq = sameCategory.reduce((max, p) => {
    const match = p.code.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0);
  return `${prefix}-${String(maxSeq + 1).padStart(3, "0")}`;
}

export type PartFormInput = {
  name: string;
  category: InventoryCategory;
  stock: number;
  minStock: number;
  unitCost: number;
  /** undefined = manter imagem atual; null = remover; string = nova URL */
  image?: string | null;
};

export function addInventoryPart(input: PartFormInput): InventoryPart {
  const code = generatePartCode(input.category);
  const part: InventoryPart = {
    id: `p-${Date.now()}`,
    code,
    name: input.name.trim(),
    category: input.category,
    compatibility: "—",
    stock: input.stock,
    minStock: input.minStock,
    stockLevel: computeStockLevel(input.stock, input.minStock),
    location: "—",
    unitCost: input.unitCost,
    supplierId: "sup-rpb",
    supplierName: "—",
    image: input.image || "/images/gallery-1.jpg",
  };
  parts = [part, ...parts];
  emit();
  return part;
}

export function updateInventoryPart(
  id: string,
  input: PartFormInput,
): InventoryPart | null {
  const index = parts.findIndex((p) => p.id === id);
  if (index < 0) return null;

  const existing = parts[index]!;
  const updated: InventoryPart = {
    ...existing,
    name: input.name.trim(),
    category: input.category,
    stock: input.stock,
    minStock: input.minStock,
    unitCost: input.unitCost,
    stockLevel: computeStockLevel(input.stock, input.minStock),
    image:
      input.image === null
        ? undefined
        : input.image !== undefined
          ? input.image || undefined
          : existing.image,
  };
  parts = [...parts.slice(0, index), updated, ...parts.slice(index + 1)];
  emit();
  return updated;
}

export function deleteInventoryPart(id: string): boolean {
  const before = parts.length;
  parts = parts.filter((p) => p.id !== id);
  if (parts.length === before) return false;
  emit();
  return true;
}

export function getInventoryPartById(id: string): InventoryPart | null {
  return parts.find((p) => p.id === id) ?? null;
}
