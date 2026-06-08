"use client";



import { useFinanceMeta } from "@/lib/query/hooks/use-finance-meta";

import { FinancialRepositoryMock } from "@/repositories/finance/FinancialRepositoryMock";

import { AdminTablePagination } from "../admin-table-pagination";



type Props = {

  page: number;

  pageSize: number;

  totalItems: number;

  onPageChange: (page: number) => void;

  onPageSizeChange: (size: number) => void;

};



export function FinancialTablePagination(props: Props) {

  const { data: meta } = useFinanceMeta();

  const pageSizeOptions = meta?.tablePageSizes ?? FinancialRepositoryMock.getTablePageSizes();



  return (

    <AdminTablePagination

      {...props}

      pageSizeOptions={pageSizeOptions}

    />

  );

}

