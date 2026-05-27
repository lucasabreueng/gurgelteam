"use client";

import type { PartCatalogItem, PartUnit, PartUsageType, ClientBillingMode, RegisterPartOsContext } from "@/lib/contracts/parts";

import { PartsServiceMock } from "@/services/parts/partsServiceMock";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PartCostSummary } from "./part-cost-summary";
import { PartSearchInput } from "./part-search-input";
import { QuantitySelector } from "./quantity-selector";
import { QuickPartHistory } from "./quick-part-history";
import { RegisterPartDrawerFooter } from "./register-part-drawer-footer";
import { RegisterPartHeader } from "./register-part-header";
import { RegisterPartMediaUploader } from "./register-part-media-uploader";
import { SelectedPartCard } from "./selected-part-card";
import { SmartPartSuggestions } from "./smart-part-suggestions";
import { StockAlert } from "./stock-alert";
import { TechnicalNotes } from "./technical-notes";
import { UsageTypeSelector } from "./usage-type-selector";

type Props = {
  open: boolean;
  onClose: () => void;
  context?: RegisterPartOsContext;
  onSuccess?: (message: string) => void;
};

function initialFormState(part: PartCatalogItem | null) {
  return {
    selected: part,
    quantity: 1,
    unit: part?.defaultUnit ?? ("unidade" as PartUnit),
    usageType: "corretiva" as PartUsageType,
    notes: "",
    billing: "orcamento" as ClientBillingMode,
  };
}

export function RegisterPartDrawer({
  open,
  onClose,
  context = PartsServiceMock.getDefaultRegisterPartOs(),
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<PartCatalogItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<PartUnit>("unidade");
  const [usageType, setUsageType] = useState<PartUsageType>("corretiva");
  const [notes, setNotes] = useState("");
  const [billing, setBilling] = useState<ClientBillingMode>("orcamento");

  const resetForm = useCallback((keepPart?: PartCatalogItem | null) => {
    const part = keepPart ?? null;
    const init = initialFormState(part);
    setSelected(init.selected);
    setQuantity(init.quantity);
    setUnit(init.unit);
    setUsageType(init.usageType);
    setNotes(init.notes);
    setBilling(init.billing);
  }, []);

  useEffect(() => {
    if (!open) return;
    resetForm();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, resetForm]);

  const stockAlert = useMemo(() => {
    if (!selected) return null;
    return PartsServiceMock.getStockAlert(selected, quantity);
  }, [selected, quantity]);

  const canSave = selected && stockAlert?.tone !== "error";

  const selectPart = (part: PartCatalogItem) => {
    setSelected(part);
    setUnit(part.defaultUnit);
    setQuantity(1);
  };

  const mockSave = (addAnother: boolean) => {
    if (!selected || !canSave) return;
    const msgs = [
      "Estoque atualizado (mock).",
      "Custo adicionado à OS (mock).",
      "Histórico do kart atualizado (mock).",
    ];
    if (context.ownership === "client") {
      msgs.push("Financeiro do cliente atualizado (mock).");
    }
    if (stockAlert?.tone === "critical" || stockAlert?.tone === "low") {
      msgs.push("Alerta de reposição criado (mock).");
    }
    onSuccess?.(
      `${selected.name} registrada — ${msgs.join(" ")}`
    );
    if (addAnother) {
      resetForm();
      return;
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[225] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Registrar peça"
        className="relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl lg:max-w-[min(42vw,640px)]"
      >
        <RegisterPartHeader
          context={context}
          onClose={onClose}
          onSave={() => mockSave(false)}
          onSaveAndAddAnother={() => mockSave(true)}
          saveDisabled={!canSave}
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
          <div className="mb-4 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-3 py-2.5 text-[11px] text-neutral-600">
            <span className="font-bold text-[#0d1f3c]">Vinculação automática: </span>
            {context.osNumber} · Kart {String(context.kartNumber).padStart(2, "0")} ·{" "}
            {context.mechanicName} · {context.maintenanceType} · {context.openedAt}
          </div>

          <div className="space-y-4">
            <PartSearchInput
              selectedId={selected?.id ?? null}
              onSelect={selectPart}
              onScan={selectPart}
            />

            {selected ? (
              <>
                <SelectedPartCard part={selected} />
                {stockAlert && stockAlert.tone !== "ok" ? (
                  <StockAlert
                    message={stockAlert.message}
                    tone={stockAlert.tone}
                  />
                ) : null}
                <QuantitySelector
                  quantity={quantity}
                  unit={unit}
                  stockBefore={selected.stock}
                  onQuantityChange={setQuantity}
                  onUnitChange={setUnit}
                />
                <UsageTypeSelector value={usageType} onChange={setUsageType} />
                <PartCostSummary
                  unitCost={selected.unitCost}
                  quantity={quantity}
                  supplier={selected.supplier}
                  isClientKart={context.ownership === "client"}
                  billingMode={billing}
                  onBillingChange={setBilling}
                />
                <TechnicalNotes value={notes} onChange={setNotes} />
                <RegisterPartMediaUploader />
                <SmartPartSuggestions />
              </>
            ) : (
              <SmartPartSuggestions />
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-3 py-2 md:px-4">
          <QuickPartHistory items={PartsServiceMock.getDefaultQuickHistory()} />
        </div>

        <RegisterPartDrawerFooter
          onSave={() => mockSave(false)}
          onSaveAndAddAnother={() => mockSave(true)}
          onRequestPurchase={() =>
            onSuccess?.("Solicitação de compra enviada (mock).")
          }
          onCancel={onClose}
          saveDisabled={!canSave}
        />
      </aside>
    </div>
  );
}
