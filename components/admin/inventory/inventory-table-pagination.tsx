"use client";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { AdminTablePagination } from "../admin-table-pagination";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function InventoryTablePagination(props: Props) {
  return (
    <AdminTablePagination
      {...props}
      pageSizeOptions={InventoryServiceMock.getTablePageSizes()}
    />
  );
}
