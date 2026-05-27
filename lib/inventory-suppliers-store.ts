"use client";

import {
  INVENTORY_SUPPLIERS,
  type InventorySupplier,
  type SupplierStatus,
} from "@/lib/admin-inventory-mocks";

let suppliers: InventorySupplier[] = [...INVENTORY_SUPPLIERS];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeInventorySuppliers(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getInventorySuppliers(): InventorySupplier[] {
  return suppliers;
}

export function getInventorySupplierById(id: string): InventorySupplier | null {
  return suppliers.find((s) => s.id === id) ?? null;
}

export type SupplierFormInput = {
  name: string;
  cnpj: string;
  city: string;
  phone: string;
  whatsapp: string;
  email?: string;
  status: SupplierStatus;
  avgLeadDays: number;
  partsSupplied: string[];
};

export function generateSupplierCode(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const letters = words
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").charAt(0))
    .join("")
    .toUpperCase();
  const base = (letters.length >= 3
    ? letters.slice(0, 3)
    : name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 3)
  ).padEnd(3, "X");

  let code = `FOR-${base}`;
  let suffix = 1;
  while (suppliers.some((s) => s.code === code)) {
    code = `FOR-${base.slice(0, 2)}${suffix}`;
    suffix += 1;
  }
  return code;
}

export function addInventorySupplier(
  input: SupplierFormInput,
): InventorySupplier {
  const supplier: InventorySupplier = {
    id: `sup-${Date.now()}`,
    code: generateSupplierCode(input.name),
    name: input.name.trim(),
    cnpj: input.cnpj.trim(),
    city: input.city.trim(),
    phone: input.phone.trim(),
    whatsapp: input.whatsapp.trim(),
    email: input.email?.trim() || undefined,
    status: input.status,
    avgLeadDays: input.avgLeadDays,
    partsSupplied: input.partsSupplied,
    lastPurchase: "",
  };
  suppliers = [...suppliers, supplier];
  emit();
  return supplier;
}

export function updateInventorySupplier(
  id: string,
  input: SupplierFormInput,
): InventorySupplier | null {
  const index = suppliers.findIndex((s) => s.id === id);
  if (index < 0) return null;

  const existing = suppliers[index]!;
  const updated: InventorySupplier = {
    ...existing,
    name: input.name.trim(),
    cnpj: input.cnpj.trim(),
    city: input.city.trim(),
    phone: input.phone.trim(),
    whatsapp: input.whatsapp.trim(),
    email: input.email?.trim() || undefined,
    status: input.status,
    avgLeadDays: input.avgLeadDays,
    partsSupplied: input.partsSupplied,
  };
  suppliers = [
    ...suppliers.slice(0, index),
    updated,
    ...suppliers.slice(index + 1),
  ];
  emit();
  return updated;
}

export function deleteInventorySupplier(id: string): boolean {
  const before = suppliers.length;
  suppliers = suppliers.filter((s) => s.id !== id);
  if (suppliers.length === before) return false;
  emit();
  return true;
}
