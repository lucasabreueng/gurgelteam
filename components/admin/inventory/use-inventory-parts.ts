"use client";

import { useSyncExternalStore } from "react";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

export function useInventoryParts() {
  return useSyncExternalStore(
    InventoryServiceMock.subscribeInventoryParts,
    InventoryServiceMock.getInventoryParts,
    InventoryServiceMock.getInventoryParts,
  );
}
