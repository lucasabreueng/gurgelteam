import {
  getInventorySuppliers,
  subscribeInventorySuppliers,
} from "@/lib/inventory-suppliers-store";

export const InventorySuppliersRepositoryMock = {
  subscribe: subscribeInventorySuppliers,
  getAll: getInventorySuppliers,
};

