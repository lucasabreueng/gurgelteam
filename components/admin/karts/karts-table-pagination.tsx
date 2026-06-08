"use client";

import { KartsServiceMock } from "@/services/karts/kartsServiceMock";

import { AdminTablePagination } from "../admin-table-pagination";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function KartsTablePagination(props: Props) {
  return (
    <AdminTablePagination
      {...props}
      pageSizeOptions={KartsServiceMock.getTablePageSizes()}
    />
  );
}
