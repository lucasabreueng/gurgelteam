export type SupplierStatus = "ativo" | "atrasado" | "inativo";

export type InventoryPartDTO = {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unitCost: number;
  supplierId: string;
  supplierName: string;
  stockLevel?: "critical" | "low" | "ok";
  createdAt?: string;
  updatedAt?: string;
};

export type SupplierDTO = {
  id: string;
  code: string;
  name: string;
  cnpj: string;
  city: string;
  phone: string;
  whatsapp: string;
  email?: string;
  status: SupplierStatus;
  avgLeadDays: number;
  partsSupplied: string[];
  lastPurchase: string; // ISO YYYY-MM-DD
  createdAt?: string;
  updatedAt?: string;
};

