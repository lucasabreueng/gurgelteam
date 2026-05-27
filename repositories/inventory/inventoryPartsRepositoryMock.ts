import {
  getInventoryParts,
  subscribeInventoryParts,
} from "@/lib/inventory-parts-store";

export const InventoryPartsRepositoryMock = {
  subscribe: subscribeInventoryParts,
  getAll: getInventoryParts,
};

