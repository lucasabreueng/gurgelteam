"use client";

import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiShoppingCart,
} from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { AdminPageHeader } from "../admin-page-header";
import { RegisterPartButton } from "./register-part-button";
import { RegisterSupplierButton } from "./register-supplier-button";

type Props = {
  title: string;
  subtitle: string;
  onRegisterEntry?: () => void;
  onRegisterExit?: () => void;
  onRequestPurchase?: () => void;
  onRegisterPart?: () => void;
  onRegisterSupplier?: () => void;
};

export function InventoryHeader({
  title,
  subtitle,
  onRegisterEntry,
  onRegisterExit,
  onRequestPurchase,
  onRegisterPart,
  onRegisterSupplier,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <AdminPageHeader
      title={title}
      subtitle={subtitle}
      actions={
        onRegisterPart ||
        onRegisterSupplier ||
        onRegisterEntry ||
        onRegisterExit ||
        onRequestPurchase ? (
          <>
            {onRegisterPart ? <RegisterPartButton onClick={onRegisterPart} /> : null}
            {onRegisterSupplier ? (
              <RegisterSupplierButton onClick={onRegisterSupplier} />
            ) : null}
            {onRegisterEntry ? (
              <button
                type="button"
                onClick={onRegisterEntry}
                className="btn-outline-sm bg-white"
              >
                <HiArrowDownTray className="h-4 w-4" aria-hidden />
                {tabletLandscape ? "Entrada" : "Registrar entrada"}
              </button>
            ) : null}
            {onRegisterExit ? (
              <button
                type="button"
                onClick={onRegisterExit}
                className="btn-outline-sm bg-white"
              >
                <HiArrowUpTray className="h-4 w-4" aria-hidden />
                {tabletLandscape ? "Saída" : "Registrar saída"}
              </button>
            ) : null}
            {onRequestPurchase ? (
              <button
                type="button"
                onClick={onRequestPurchase}
                className="btn-primary-sm"
              >
                <HiShoppingCart className="h-4 w-4" aria-hidden />
                {tabletLandscape ? "Compra" : "Solicitar compra"}
              </button>
            ) : null}
          </>
        ) : undefined
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
