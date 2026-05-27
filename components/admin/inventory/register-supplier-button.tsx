"use client";

import { HiPlus } from "react-icons/hi2";

type Props = {
  onClick?: () => void;
};

export function RegisterSupplierButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-outline-sm bg-white"
    >
      <HiPlus className="h-4 w-4" aria-hidden />
      Cadastrar fornecedor
    </button>
  );
}
