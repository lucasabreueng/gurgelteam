"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchableSelectDropdown } from "../../inventory/searchable-select-dropdown";
import { SettingsDropdown } from "../../settings/settings-dropdown";
import {
  SettingsField,
  settingsInputClass,
  settingsTextareaClass,
} from "../../settings/settings-section";
import { SettingsCheckbox } from "../../settings/settings-checkbox";
import { isCompleteBrazilDate } from "@/lib/brazil-date-input";
import {
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_ORIGIN_OPTIONS,
  FUEL_TARGET_OPTIONS,
  getBillingKartOptions,
  getBillingStockOptions,
  getBillingSupplierOptions,
  INSTALLMENT_OPTIONS,
  MAINTENANCE_CATEGORY_OPTIONS,
  mockSaveExpense,
  PAYMENT_METHOD_BILLING_OPTIONS,
  type ExpenseCategoryKey,
  type ExpenseOriginKey,
  type ExpenseSituationKey,
  type FuelTargetKey,
  type MaintenanceCategoryKey,
} from "@/lib/admin-new-billing-mocks";
import { BillingAttachmentField, BillingDateInput } from "./billing-form-fields";
import {
  BILLING_EXPENSE_STEP_LABELS,
  formatInstallmentPreviewMessage,
  formatMoneyInput,
  parseMoneyInput,
  todayBrazilDate,
} from "./billing-utils";
import { BillingFormCard, BillingSummaryPanel } from "./billing-summary-panel";
import { FinancialBillingDrawerShell } from "./financial-billing-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
};

const EMPTY = {
  origin: "" as ExpenseOriginKey | "",
  maintenanceCategory: "" as MaintenanceCategoryKey | "",
  fuelTarget: "" as FuelTargetKey | "",
  stockItemId: "",
  supplierId: "",
  kartId: "",
  category: "" as ExpenseCategoryKey | "",
  description: "",
  amount: "",
  expenseDate: todayBrazilDate(),
  situation: "pago" as ExpenseSituationKey,
  paymentMethod: "pix",
  paidDate: todayBrazilDate(),
  paidAmount: "",
  isPartialPayment: false,
  dueDate: "",
  installments: "1",
  financialNote: "",
  observations: "",
};

const KART_RELATED_ORIGINS = new Set<ExpenseOriginKey>([
  "manutencao_kart",
  "combustivel",
  "estoque",
]);

const KART_RELATED_CATEGORIES = new Set<ExpenseCategoryKey>([
  "pneus",
  "pecas",
  "manutencao",
  "combustivel",
]);

export function NewExpenseDrawer({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = useCallback(() => {
    setStep(1);
    setForm({
      ...EMPTY,
      expenseDate: todayBrazilDate(),
      paidDate: todayBrazilDate(),
    });
    setErrors({});
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const supplierOptions = useMemo(() => getBillingSupplierOptions(), []);
  const kartOptions = useMemo(() => getBillingKartOptions(), []);
  const stockOptions = useMemo(() => getBillingStockOptions(), []);

  const amountNum = parseMoneyInput(form.amount);
  const paidNum = form.isPartialPayment ? parseMoneyInput(form.paidAmount) : amountNum;
  const supplierName = supplierOptions.find((s) => s.value === form.supplierId)?.label ?? "";

  const showKartField =
    (form.origin && KART_RELATED_ORIGINS.has(form.origin)) ||
    (form.category && KART_RELATED_CATEGORIES.has(form.category));

  const situationLabel = form.situation === "pago" ? "Pago" : "Pagar depois";

  const installmentMessage = useMemo(
    () => formatInstallmentPreviewMessage(form.installments, form.dueDate, amountNum, "despesa"),
    [form.installments, form.dueDate, amountNum],
  );

  const validateStep = (s: number): boolean => {
    const next: Record<string, string> = {};
    if (s === 1) {
      if (!form.origin) next.origin = "Selecione a origem.";
      if (form.origin === "manutencao_kart" && !form.maintenanceCategory) {
        next.maintenanceCategory = "Selecione a categoria da manutenção.";
      }
      if (form.origin === "combustivel" && !form.fuelTarget) {
        next.fuelTarget = "Selecione o alvo.";
      }
      if (form.origin === "estoque" && !form.stockItemId) {
        next.stockItemId = "Selecione um item.";
      }
      if (form.origin === "fornecedor" && !form.supplierId) {
        next.supplierId = "Selecione o fornecedor.";
      }
      if (!form.category) next.category = "Selecione a categoria.";
      if (!form.description.trim()) next.description = "Informe a descrição.";
      if (amountNum <= 0) next.amount = "Informe um valor válido.";
      if (!isCompleteBrazilDate(form.expenseDate)) {
        next.expenseDate = "Informe a data no formato dd/mm/aaaa.";
      }
      if (showKartField && !form.kartId) next.kartId = "Selecione o kart.";
    }
    if (s === 2) {
      if (form.situation === "pago") {
        if (!isCompleteBrazilDate(form.paidDate)) {
          next.paidDate = "Informe a data no formato dd/mm/aaaa.";
        }
        if (form.isPartialPayment && paidNum <= 0) {
          next.paidAmount = "Informe o valor pago.";
        }
      }
      if (form.situation === "pagar_depois" && !isCompleteBrazilDate(form.dueDate)) {
        next.dueDate = "Informe a data de vencimento no formato dd/mm/aaaa.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = (andNew: boolean) => {
    if (!validateStep(2)) return;
    const result = mockSaveExpense({
      situation: form.situation,
      amount: amountNum,
      paidAmount: paidNum,
    });
    onSuccess?.(result.message);
    if (andNew) reset();
    else onClose();
  };

  const applyStock = (id: string) => {
    const item = stockOptions.find((o) => o.value === id);
    if (!item) return;
    patch({
      stockItemId: id,
      category: "pecas",
      description: item.label,
      amount: formatMoneyInput(String(Math.round(item.amount * 100))),
    });
  };

  const step1 = (
    <BillingFormCard>
      <SettingsField label="Origem *">
        <SettingsDropdown
          aria-label="Origem da despesa"
          options={[{ value: "", label: "Selecione a origem…" }, ...EXPENSE_ORIGIN_OPTIONS]}
          value={form.origin}
          onSelect={(v) =>
            patch({
              origin: v as ExpenseOriginKey,
              maintenanceCategory: "",
              fuelTarget: "",
              stockItemId: "",
              supplierId: "",
            })
          }
        />
        {errors.origin ? <p className="text-[12px] font-medium text-[#c41e3a]">{errors.origin}</p> : null}
      </SettingsField>

      {form.origin === "manutencao_kart" ? (
        <>
          <SettingsField label="Kart relacionado">
            <SettingsDropdown
              aria-label="Kart"
              options={[{ value: "", label: "Selecione…" }, ...kartOptions]}
              value={form.kartId}
              onSelect={(v) => patch({ kartId: v })}
            />
          </SettingsField>
          <SettingsField label="Categoria da manutenção *">
            <SettingsDropdown
              aria-label="Categoria manutenção"
              options={[{ value: "", label: "Selecione…" }, ...MAINTENANCE_CATEGORY_OPTIONS]}
              value={form.maintenanceCategory}
              onSelect={(v) => {
                const catMap: Partial<Record<MaintenanceCategoryKey, ExpenseCategoryKey>> = {
                  pneus: "pneus",
                  motor: "manutencao",
                  corrente: "pecas",
                  chassi: "manutencao",
                  freios: "manutencao",
                  outros: "manutencao",
                };
                patch({
                  maintenanceCategory: v as MaintenanceCategoryKey,
                  category: catMap[v as MaintenanceCategoryKey] ?? "manutencao",
                });
              }}
            />
            {errors.maintenanceCategory ? (
              <p className="text-[12px] font-medium text-[#c41e3a]">{errors.maintenanceCategory}</p>
            ) : null}
          </SettingsField>
        </>
      ) : null}

      {form.origin === "combustivel" ? (
        <SettingsField label="Destino *">
          <SettingsDropdown
            aria-label="Destino combustível"
            options={[{ value: "", label: "Selecione…" }, ...FUEL_TARGET_OPTIONS]}
            value={form.fuelTarget}
            onSelect={(v) => {
              patch({
                fuelTarget: v as FuelTargetKey,
                category: "combustivel",
              });
            }}
          />
          {errors.fuelTarget ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.fuelTarget}</p>
          ) : null}
        </SettingsField>
      ) : null}

      {form.origin === "estoque" ? (
        <SettingsField label="Item do estoque *">
          <SearchableSelectDropdown
            aria-label="Item estoque"
            emptyLabel="Selecione…"
            searchPlaceholder="Buscar item…"
            options={stockOptions.map((o) => ({ value: o.value, label: o.label }))}
            value={form.stockItemId}
            onSelect={(v) => applyStock(v)}
          />
          {errors.stockItemId ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.stockItemId}</p>
          ) : null}
        </SettingsField>
      ) : null}

      {form.origin === "fornecedor" ? (
        <SettingsField label="Fornecedor *">
          <SearchableSelectDropdown
            aria-label="Fornecedor"
            emptyLabel="Selecione…"
            searchPlaceholder="Buscar fornecedor…"
            options={supplierOptions}
            value={form.supplierId}
            onSelect={(v) => patch({ supplierId: v })}
          />
          {errors.supplierId ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.supplierId}</p>
          ) : null}
        </SettingsField>
      ) : null}

      <SettingsField label="Categoria *">
        <SettingsDropdown
          aria-label="Categoria despesa"
          options={[
            { value: "", label: "Selecione…" },
            ...EXPENSE_CATEGORY_OPTIONS.map((o) => ({
              value: o.value,
              label: `${o.group} · ${o.label}`,
            })),
          ]}
          value={form.category}
          onSelect={(v) => patch({ category: v as ExpenseCategoryKey })}
        />
        {errors.category ? (
          <p className="text-[12px] font-medium text-[#c41e3a]">{errors.category}</p>
        ) : null}
      </SettingsField>

      {(form.origin === "fornecedor" || form.supplierId) && form.origin !== "fornecedor" ? (
        <SettingsField label="Fornecedor">
          <SearchableSelectDropdown
            aria-label="Fornecedor"
            emptyLabel="Selecione…"
            searchPlaceholder="Buscar fornecedor…"
            options={supplierOptions}
            value={form.supplierId}
            onSelect={(v) => patch({ supplierId: v })}
          />
        </SettingsField>
      ) : null}

      <SettingsField label="Descrição *">
        <textarea
          rows={3}
          className={settingsTextareaClass}
          value={form.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="Descrição da despesa…"
        />
        {errors.description ? (
          <p className="text-[12px] font-medium text-[#c41e3a]">{errors.description}</p>
        ) : null}
      </SettingsField>

      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsField label="Valor (R$) *">
          <input
            type="text"
            inputMode="decimal"
            className={settingsInputClass}
            value={form.amount}
            onChange={(e) => patch({ amount: formatMoneyInput(e.target.value) })}
            placeholder="0,00"
          />
          {errors.amount ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.amount}</p>
          ) : null}
        </SettingsField>
        <BillingDateInput
          label="Data da despesa"
          value={form.expenseDate}
          onChange={(v) => patch({ expenseDate: v })}
          error={errors.expenseDate}
        />
      </div>

      {showKartField ? (
        <SettingsField label="Kart relacionado *">
          <SettingsDropdown
            aria-label="Kart relacionado"
            options={[{ value: "", label: "Selecione…" }, ...kartOptions]}
            value={form.kartId}
            onSelect={(v) => patch({ kartId: v })}
          />
          {errors.kartId ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.kartId}</p>
          ) : null}
        </SettingsField>
      ) : null}
    </BillingFormCard>
  );

  const step2 = (
    <BillingFormCard>
      <SettingsField label="Situação *">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "pago", label: "Pago" },
              { value: "pagar_depois", label: "Pagar depois" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => patch({ situation: opt.value })}
              className={`rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition ${
                form.situation === opt.value
                  ? "bg-[#0d1f3c] text-white"
                  : "bg-[#fafbfc] text-neutral-600 ring-1 ring-[rgba(17,17,17,0.1)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </SettingsField>

      {form.situation === "pago" ? (
        <div className="space-y-4">
          <SettingsField label="Forma de pagamento">
            <SettingsDropdown
              aria-label="Forma de pagamento"
              options={PAYMENT_METHOD_BILLING_OPTIONS}
              value={form.paymentMethod}
              onSelect={(v) => patch({ paymentMethod: v })}
            />
          </SettingsField>
          <BillingDateInput
            label="Data do pagamento"
            value={form.paidDate}
            onChange={(v) => patch({ paidDate: v })}
            error={errors.paidDate}
          />
          <div className="flex items-center gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-3">
            <SettingsCheckbox
              checked={form.isPartialPayment}
              onChange={(checked) =>
                patch({
                  isPartialPayment: checked,
                  paidAmount: checked ? form.paidAmount : form.amount,
                })
              }
              aria-label="Pagamento parcial"
            />
            <div>
              <p className="text-[13px] font-semibold text-[#111]">Pagamento parcial</p>
              <p className="text-[12px] text-neutral-500">
                Desmarque para registrar pagamento total do valor informado.
              </p>
            </div>
          </div>
          {form.isPartialPayment ? (
            <SettingsField label="Valor pago *">
              <input
                type="text"
                inputMode="decimal"
                className={settingsInputClass}
                value={form.paidAmount}
                onChange={(e) => patch({ paidAmount: formatMoneyInput(e.target.value) })}
                placeholder="0,00"
              />
              {errors.paidAmount ? (
                <p className="text-[12px] font-medium text-[#c41e3a]">{errors.paidAmount}</p>
              ) : null}
            </SettingsField>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <BillingDateInput
            label="Data de vencimento *"
            value={form.dueDate}
            onChange={(v) => patch({ dueDate: v })}
            error={errors.dueDate}
          />
          <SettingsField label="Parcelamento">
            <SettingsDropdown
              aria-label="Parcelamento"
              options={INSTALLMENT_OPTIONS}
              value={form.installments}
              onSelect={(v) => patch({ installments: v })}
            />
          </SettingsField>
          {installmentMessage ? (
            <p className="rounded-xl border border-[rgba(13,31,60,0.12)] bg-[rgba(13,31,60,0.04)] px-3 py-2.5 text-[12px] leading-relaxed text-neutral-700">
              {installmentMessage}
            </p>
          ) : null}
          <SettingsField label="Observação financeira">
            <textarea
              rows={2}
              className={settingsTextareaClass}
              value={form.financialNote}
              onChange={(e) => patch({ financialNote: e.target.value })}
            />
          </SettingsField>
        </div>
      )}

      <BillingAttachmentField />

      <SettingsField label="Observações">
        <textarea
          rows={2}
          className={settingsTextareaClass}
          value={form.observations}
          onChange={(e) => patch({ observations: e.target.value })}
          placeholder="Histórico e detalhes internos…"
        />
      </SettingsField>
    </BillingFormCard>
  );

  const footer = (
    <DrawerFooterActions columns={2}>
      <button type="button" onClick={onClose} className="btn-outline-sm bg-white">
        Cancelar
      </button>
      {step > 1 ? (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="btn-outline-sm bg-white"
        >
          Voltar
        </button>
      ) : null}
      {step < 2 ? (
        <button
          type="button"
          onClick={() => {
            if (validateStep(step)) setStep((s) => s + 1);
          }}
          className="btn-primary-sm"
        >
          Continuar
        </button>
      ) : (
        <>
          <button type="button" onClick={() => save(false)} className="btn-primary-sm">
            Salvar despesa
          </button>
          <button type="button" onClick={() => save(true)} className="btn-outline-sm bg-white">
            Salvar e nova despesa
          </button>
        </>
      )}
    </DrawerFooterActions>
  );

  return (
    <FinancialBillingDrawerShell
      open={open}
      onClose={onClose}
      title="Nova despesa"
      subtitle="Registre despesas operacionais e administrativas de forma rápida e organizada."
      currentStep={step}
      stepLabels={BILLING_EXPENSE_STEP_LABELS}
      summary={
        <BillingSummaryPanel
          clientName={supplierName}
          amount={amountNum}
          situationLabel={situationLabel}
        />
      }
      footer={footer}
    >
      {step === 1 ? step1 : step2}
    </FinancialBillingDrawerShell>
  );
}
