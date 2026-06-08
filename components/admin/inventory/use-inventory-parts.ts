"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import {
  addInventoryPart,
  deleteInventoryPart,
  getInventoryPartById,
  updateInventoryPart,
  type PartFormInput,
} from "@/lib/inventory-parts-store";
import { useSyncExternalStore } from "react";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

export function useInventoryParts() {
  const isHttp = getDataSourceMode() === "http";
  const query = useQuery({
    queryKey: queryKeys.inventory.parts(),
    queryFn: () => getAppServices().inventory.listParts(),
    enabled: isHttp,
  });
  const mockParts = useSyncExternalStore(
    InventoryServiceMock.subscribeInventoryParts,
    InventoryServiceMock.getInventoryParts,
    InventoryServiceMock.getInventoryParts,
  );
  return isHttp ? (query.data ?? []) : mockParts;
}

export function useInventoryPartMutations() {
  const queryClient = useQueryClient();
  const isHttp = getDataSourceMode() === "http";
  const inventory = getAppServices().inventory;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.inventory.parts() });

  const createMutation = useMutation({
    mutationFn: async (input: PartFormInput & { supplierId?: string }) => {
      if (isHttp) {
        return inventory.savePart({
          name: input.name,
          category: input.category,
          stock: input.stock,
          minStock: input.minStock,
          unitCost: input.unitCost,
          supplierId: input.supplierId,
        });
      }
      return addInventoryPart(input);
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: PartFormInput;
    }) => {
      if (isHttp) {
        return inventory.savePart({
          id,
          name: input.name,
          category: input.category,
          stock: input.stock,
          minStock: input.minStock,
          unitCost: input.unitCost,
        });
      }
      return updateInventoryPart(id, input);
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isHttp) {
        await inventory.deletePart(id);
        return true;
      }
      return deleteInventoryPart(id);
    },
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}

export function useInventoryPartById(partId: string | null | undefined) {
  const isHttp = getDataSourceMode() === "http" && Boolean(partId);
  const query = useQuery({
    queryKey: [...queryKeys.inventory.parts(), partId],
    queryFn: () => getAppServices().inventory.getPartById(partId!),
    enabled: isHttp,
  });
  if (isHttp) return query.data ?? null;
  return partId ? getInventoryPartById(partId) : null;
}
