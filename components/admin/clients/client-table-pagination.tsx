"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";

import { AdminTablePagination } from "../admin-table-pagination";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function ClientTablePagination(props: Props) {
  return (
    <AdminTablePagination
      {...props}
      pageSizeOptions={ClientsServiceMock.getTablePageSizes()}
    />
  );
}
