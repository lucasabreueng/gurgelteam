import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiShoppingCart,
} from "react-icons/hi2";
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
  return (
    <AdminPageHeader
      title={title}
      subtitle={subtitle}
      actions={
        <>
          <RegisterPartButton onClick={onRegisterPart} />
          <RegisterSupplierButton onClick={onRegisterSupplier} />
          <button
            type="button"
            onClick={onRegisterEntry}
            className="btn-outline-sm bg-white"
          >
            <HiArrowDownTray className="h-4 w-4" aria-hidden />
            Registrar entrada
          </button>
          <button
            type="button"
            onClick={onRegisterExit}
            className="btn-outline-sm bg-white"
          >
            <HiArrowUpTray className="h-4 w-4" aria-hidden />
            Registrar saída
          </button>
          <button
            type="button"
            onClick={onRequestPurchase}
            className="btn-primary-sm"
          >
            <HiShoppingCart className="h-4 w-4" aria-hidden />
            Solicitar compra
          </button>
        </>
      }
    />
  );
}
