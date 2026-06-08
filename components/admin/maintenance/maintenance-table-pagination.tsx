"use client";

import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";

import { AdminTablePagination } from "../admin-table-pagination";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function MaintenanceTablePagination(props: Props) {
  return (
    <AdminTablePagination
      {...props}
      pageSizeOptions={MaintenanceServiceMock.getTablePageSizes()}
    />
  );
}
