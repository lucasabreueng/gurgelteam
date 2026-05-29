"use client";

import { HiPlus } from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";

type Props = {
  onClick?: () => void;
};

export function RegisterPartButton({ onClick }: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-outline-sm bg-white"
    >
      <HiPlus className="h-4 w-4" aria-hidden />
      {tabletLandscape ? "Peças" : "Cadastrar peças"}
    </button>
  );
}
