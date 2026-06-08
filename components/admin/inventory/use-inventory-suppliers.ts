"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import {
  addInventorySupplier,
  deleteInventorySupplier,
  getInventorySupplierById,
  updateInventorySupplier,
  type SupplierFormInput,
} from "@/lib/inventory-suppliers-store";
import { useSyncExternalStore } from "react";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

export function useInventorySuppliers() {
  const isHttp = getDataSourceMode() === "http";
  const query = useQuery({
    queryKey: queryKeys.inventory.suppliers(),
    queryFn: () => getAppServices().inventory.listSuppliers(),
    enabled: isHttp,
  });
  const mockSuppliers = useSyncExternalStore(
    InventoryServiceMock.subscribeInventorySuppliers,
    InventoryServiceMock.getInventorySuppliers,
    InventoryServiceMock.getInventorySuppliers,
  );
  return isHttp ? (query.data ?? []) : mockSuppliers;
}

export function useInventorySupplierMutations() {
  const queryClient = useQueryClient();
  const isHttp = getDataSourceMode() === "http";
  const inventory = getAppServices().inventory;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.inventory.suppliers() });

  const createMutation = useMutation({
    mutationFn: async (input: SupplierFormInput) => {
      if (isHttp) {
        return inventory.saveSupplier({
          name: input.name,
          cnpj: input.cnpj,
          city: input.city,
          phone: input.phone,
          email: input.email,
          status: input.status,
          avgLeadDays: input.avgLeadDays,
        });
      }
      return addInventorySupplier(input);
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: SupplierFormInput;
    }) => {
      if (isHttp) {
        return inventory.saveSupplier({
          id,
          name: input.name,
          cnpj: input.cnpj,
          city: input.city,
          phone: input.phone,
          email: input.email,
          status: input.status,
          avgLeadDays: input.avgLeadDays,
        });
      }
      return updateInventorySupplier(id, input);
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isHttp) {
        await inventory.deleteSupplier(id);
        return true;
      }
      return deleteInventorySupplier(id);
    },
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}

export function useInventorySupplierById(supplierId: string | null | undefined) {
  const isHttp = getDataSourceMode() === "http" && Boolean(supplierId);
  const query = useQuery({
    queryKey: [...queryKeys.inventory.suppliers(), supplierId],
    queryFn: () => getAppServices().inventory.getSupplierById(supplierId!),
    enabled: isHttp,
  });
  if (isHttp) return query.data ?? null;
  return supplierId ? getInventorySupplierById(supplierId) : null;
}
