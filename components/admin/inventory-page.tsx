"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons/lib";
import {
  HiClock,
  HiCube,
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiShoppingCart,
  HiTruck,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { InventoryTabKey, PurchaseOrder } from "@/lib/contracts/inventory";
import { useInventoryKpis } from "@/lib/query/hooks/use-inventory-catalog";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import {
  deleteInventoryPart,
  getInventoryPartById,
} from "@/lib/inventory-parts-store";
import {
  deleteInventorySupplier,
  getInventorySupplierById,
} from "@/lib/inventory-suppliers-store";
import { AdminResponsiveKpis } from "./admin-responsive-kpis";
import { AppModal } from "@/components/ui/app-modal";
import { AdminShell } from "./admin-shell";
import {
  InventoryEntryDrawer,
  InventoryExitDrawer,
  InventoryPurchaseDrawer,
} from "./inventory/inventory-drawers";
import { SupplierDetailsDrawer } from "./inventory/supplier-details-drawer";
import { SupplierFormDrawer } from "./inventory/supplier-form-drawer";
import { InventoryHeader } from "./inventory/inventory-header";
import { InventoryHistoryTimeline } from "./inventory/inventory-history-timeline";
import { InventoryMovements } from "./inventory/inventory-movements";
import { InventoryOverview } from "./inventory/inventory-overview";
import { InventoryTabs } from "./inventory/inventory-tabs";
import { PartDetailsDrawer } from "./inventory/part-details-drawer";
import { PartFormDrawer } from "./inventory/part-form-drawer";
import { PartsTable } from "./inventory/parts-table";
import { PurchaseOrders } from "./inventory/purchase-orders";
import { SuppliersTable } from "./inventory/suppliers-table";

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  estoque: "/admin/estoque",
  financeiro: "/admin/financeiro",
  configuracoes: "/admin/configuracoes",
};

const KPI_ICONS: Record<string, IconType> = {
  items: HiCube,
  critical: HiExclamationTriangle,
  "used-today": HiTruck,
  "pending-purchases": HiShoppingCart,
  "total-value": HiCurrencyDollar,
  "last-movement": HiClock,
};

export function InventoryPage() {
  const { data: inventoryKpis = [] } = useInventoryKpis();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InventoryTabKey>("overview");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [entryOpen, setEntryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [supplierDetailsId, setSupplierDetailsId] = useState<string | null>(
    null,
  );
  const [supplierFormOpen, setSupplierFormOpen] = useState(false);
  const [supplierFormEditId, setSupplierFormEditId] = useState<string | null>(
    null,
  );
  const [deleteSupplierId, setDeleteSupplierId] = useState<string | null>(null);
  const [partId, setPartId] = useState<string | null>(null);
  const [partFormOpen, setPartFormOpen] = useState(false);
  const [partFormEditId, setPartFormEditId] = useState<string | null>(null);
  const [deletePartId, setDeletePartId] = useState<string | null>(null);
  const [purchasePrefill, setPurchasePrefill] = useState<string | undefined>();

  const tabMeta = InventoryServiceMock.getTabMeta()[activeTab];
  const deleteTarget = deletePartId
    ? getInventoryPartById(deletePartId)
    : null;
  const deleteSupplierTarget = deleteSupplierId
    ? getInventorySupplierById(deleteSupplierId)
    : null;

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router],
  );

  const handleAction = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 5000);
  }, []);

  const openPurchase = useCallback((prefill?: string) => {
    setPurchasePrefill(prefill);
    setPurchaseOpen(true);
  }, []);

  const openPartForm = useCallback((editId?: string | null) => {
    setPartFormEditId(editId ?? null);
    setPartFormOpen(true);
  }, []);

  const openSupplierForm = useCallback((editId?: string | null) => {
    setSupplierFormEditId(editId ?? null);
    setSupplierFormOpen(true);
  }, []);

  const confirmDeleteSupplier = useCallback(() => {
    if (!deleteSupplierId) return;
    const supplier = getInventorySupplierById(deleteSupplierId);
    if (!supplier) {
      handleAction("Fornecedor não encontrado.");
      setDeleteSupplierId(null);
      return;
    }
    deleteInventorySupplier(deleteSupplierId);
    if (supplierDetailsId === deleteSupplierId) setSupplierDetailsId(null);
    if (supplierFormEditId === deleteSupplierId) {
      setSupplierFormEditId(null);
      setSupplierFormOpen(false);
    }
    handleAction(`Fornecedor ${supplier.name} excluído.`);
    setDeleteSupplierId(null);
  }, [deleteSupplierId, handleAction, supplierDetailsId, supplierFormEditId]);

  const confirmDeletePart = useCallback(() => {
    if (!deletePartId) return;
    const part = getInventoryPartById(deletePartId);
    if (!part) {
      handleAction("Peça não encontrada.");
      setDeletePartId(null);
      return;
    }
    deleteInventoryPart(deletePartId);
    if (partId === deletePartId) setPartId(null);
    handleAction(`Peça ${part.name} excluída.`);
    setDeletePartId(null);
  }, [deletePartId, handleAction, partId]);

  const tabContent = () => {
    switch (activeTab) {
      case "overview":
        return <InventoryOverview onOpenPart={setPartId} />;
      case "parts":
        return (
          <PartsTable
            onOpenPart={setPartId}
            onEditPart={(id) => openPartForm(id)}
            onDeletePart={setDeletePartId}
          />
        );
      case "movements":
        return <InventoryMovements />;
      case "purchases":
        return (
          <PurchaseOrders
            onRequestPurchase={(order: PurchaseOrder) =>
              openPurchase(order.partName)
            }
            onReceive={(order: PurchaseOrder) =>
              handleAction(
                `Recebimento de ${order.partName} registrado (mock).`,
              )
            }
          />
        );
      case "suppliers":
        return (
          <SuppliersTable
            onOpenSupplier={setSupplierDetailsId}
            onEditSupplier={(id) => openSupplierForm(id)}
            onDeleteSupplier={setDeleteSupplierId}
          />
        );
      case "history":
        return <InventoryHistoryTimeline />;
      default:
        return null;
    }
  };

  return (
    <>
      <AdminShell
        activeNav="estoque"
        onNav={onNav}
        mobileTitle={tabMeta.title}
        pageHeader={
          <InventoryHeader
            title={tabMeta.title}
            subtitle={tabMeta.subtitle}
            onRegisterEntry={() => setEntryOpen(true)}
            onRegisterExit={() => setExitOpen(true)}
            onRequestPurchase={() => openPurchase()}
            onRegisterPart={() => openPartForm(null)}
            onRegisterSupplier={() => openSupplierForm(null)}
          />
        }
        fixedSubHeader={
          <InventoryTabs active={activeTab} onChange={setActiveTab} />
        }
      >
        {feedback ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900"
          >
            {feedback}
          </p>
        ) : null}

        {activeTab === "overview" ? (
          <AdminResponsiveKpis
            kpis={inventoryKpis}
            icons={KPI_ICONS}
            desktopClassName="admin-page-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6"
          />
        ) : null}

        <div
          role="tabpanel"
          id={`inventory-panel-${activeTab}`}
          aria-labelledby={`inventory-tab-${activeTab}`}
          className="admin-page-stack pb-10 lg:pb-12"
        >
          {tabContent()}
        </div>
      </AdminShell>

      <PartDetailsDrawer partId={partId} onClose={() => setPartId(null)} />

      <PartFormDrawer
        open={partFormOpen}
        partId={partFormEditId}
        onClose={() => {
          setPartFormOpen(false);
          setPartFormEditId(null);
        }}
        onSuccess={handleAction}
      />

      <AppModal
        open={Boolean(deletePartId)}
        onClose={() => setDeletePartId(null)}
        title="Excluir peça?"
        description={
          deleteTarget
            ? `A peça "${deleteTarget.name}" (${deleteTarget.code}) será removida do catálogo.`
            : "Confirmar exclusão desta peça?"
        }
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeletePartId(null)}
              className="btn-outline-sm bg-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDeletePart}
              className="btn-primary-sm bg-red-700 hover:bg-red-800"
            >
              Excluir
            </button>
          </div>
        }
      >
        <p className="text-sm text-neutral-600">
          Esta ação não pode ser desfeita no ambiente de demonstração.
        </p>
      </AppModal>

      <InventoryEntryDrawer
        open={entryOpen}
        onClose={() => setEntryOpen(false)}
        onSuccess={handleAction}
      />
      <InventoryExitDrawer
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        onSuccess={handleAction}
      />
      <InventoryPurchaseDrawer
        open={purchaseOpen}
        onClose={() => {
          setPurchaseOpen(false);
          setPurchasePrefill(undefined);
        }}
        onSuccess={handleAction}
        prefillPart={purchasePrefill}
      />
      <SupplierDetailsDrawer
        supplierId={supplierDetailsId}
        onClose={() => setSupplierDetailsId(null)}
      />

      <SupplierFormDrawer
        open={supplierFormOpen}
        supplierId={supplierFormEditId}
        onClose={() => {
          setSupplierFormOpen(false);
          setSupplierFormEditId(null);
        }}
        onSuccess={handleAction}
      />

      <AppModal
        open={Boolean(deleteSupplierId)}
        onClose={() => setDeleteSupplierId(null)}
        title="Excluir fornecedor?"
        description={
          deleteSupplierTarget
            ? `O fornecedor "${deleteSupplierTarget.name}" (${deleteSupplierTarget.code}) será removido.`
            : "Confirmar exclusão deste fornecedor?"
        }
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteSupplierId(null)}
              className="btn-outline-sm bg-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDeleteSupplier}
              className="btn-primary-sm bg-red-700 hover:bg-red-800"
            >
              Excluir
            </button>
          </div>
        }
      >
        <p className="text-sm text-neutral-600">
          Esta ação não pode ser desfeita no ambiente de demonstração.
        </p>
      </AppModal>
    </>
  );
}
