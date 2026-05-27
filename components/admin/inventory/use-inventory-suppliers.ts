"use client";

import { useSyncExternalStore } from "react";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

export function useInventorySuppliers() {
  return useSyncExternalStore(
    InventoryServiceMock.subscribeInventorySuppliers,
    InventoryServiceMock.getInventorySuppliers,
    InventoryServiceMock.getInventorySuppliers,
  );
}
