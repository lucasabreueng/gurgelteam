"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { SearchableSelectDropdown } from "../../inventory/searchable-select-dropdown";
import { SettingsDropdown } from "../../settings/settings-dropdown";
import {
  SettingsField,
  settingsInputClass,
  settingsOutlineButtonClass,
  settingsTextareaClass,
} from "../../settings/settings-section";
import { SettingsCheckbox } from "../../settings/settings-checkbox";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { isCompleteBrazilDate } from "@/lib/brazil-date-input";
import {
  getBillingClientOptions,
  getBillingEventOptions,
  getBillingProductOptions,
  getBillingScheduleOptions,
  INSTALLMENT_OPTIONS,
  mockSaveRevenue,
  PAYMENT_METHOD_BILLING_OPTIONS,
  REVENUE_CATEGORY_OPTIONS,
  REVENUE_ORIGIN_OPTIONS,
  type RevenueCategoryKey,
  type RevenueOriginKey,
  type RevenueSituationKey,
} from "@/lib/admin-new-billing-mocks";
import { BillingNewClientPanel } from "./billing-new-client-panel";
import { BillingAttachmentField, BillingDateInput } from "./billing-form-fields";
import {
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
  origin: "" as RevenueOriginKey | "",
  scheduleId: "",
  productId: "",
  eventId: "",
  category: "" as RevenueCategoryKey | "",
  clientId: "",
  description: "",
  amount: "",
  revenueDate: todayBrazilDate(),
  situation: "recebido_agora" as RevenueSituationKey,
  paymentMethod: "pix",
  receivedDate: todayBrazilDate(),
  receivedAmount: "",
  isPartialReceipt: false,
  dueDate: "",
  installments: "1",
  financialNote: "",
  fieldsLocked: true,
};

export function NewRevenueDrawer({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [extraClients, setExtraClients] = useState<{ value: string; label: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = useCallback(() => {
    setStep(1);
    setNewClientOpen(false);
    setForm({
      ...EMPTY,
      revenueDate: todayBrazilDate(),
      receivedDate: todayBrazilDate(),
    });
    setErrors({});
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const scheduleOptions = useMemo(() => getBillingScheduleOptions(), []);
  const productOptions = useMemo(() => getBillingProductOptions(), []);
  const eventOptions = useMemo(() => getBillingEventOptions(), []);
  const clientOptions = useMemo(
    () => [...getBillingClientOptions(), ...extraClients],
    [extraClients],
  );

  const applySchedule = (id: string) => {
    const item = scheduleOptions.find((o) => o.id === id);
    if (!item) return;
    patch({
      scheduleId: id,
      clientId: item.clientId,
      category: item.category,
      description: item.description,
      amount: formatMoneyInput(String(Math.round(item.amount * 100))),
      fieldsLocked: true,
    });
  };

  const applyProduct = (id: string) => {
    const item = productOptions.find((o) => o.id === id);
    if (!item) return;
    patch({
      productId: id,
      category: "produto",
      description: item.productName,
      amount: formatMoneyInput(String(Math.round(item.amount * 100))),
    });
  };

  const applyEvent = (id: string) => {
    const item = eventOptions.find((o) => o.id === id);
    if (!item) return;
    patch({
      eventId: id,
      category: "evento",
      description: item.description,
      amount: formatMoneyInput(String(Math.round(item.amount * 100))),
    });
  };

  const amountNum = parseMoneyInput(form.amount);
  const receivedNum = form.isPartialReceipt
    ? parseMoneyInput(form.receivedAmount)
    : amountNum;
  const clientName = clientOptions.find((c) => c.value === form.clientId)?.label ?? "";

  const situationLabel =
    form.situation === "recebido_agora" ? "Recebido agora" : "Receber depois";

  const installmentMessage = useMemo(
    () => formatInstallmentPreviewMessage(form.installments, form.dueDate, amountNum),
    [form.installments, form.dueDate, amountNum],
  );

  const revenueOriginOptions = REVENUE_ORIGIN_OPTIONS;

  const validateStep = (s: number): boolean => {
    const next: Record<string, string> = {};
    if (s === 1) {
      if (!form.origin) next.origin = "Selecione a origem.";
      if (form.origin === "agendamento" && !form.scheduleId) {
        next.scheduleId = "Selecione um agendamento.";
      }
      if (form.origin === "produto" && !form.productId) {
        next.productId = "Selecione um produto.";
      }
      if (form.origin === "evento" && !form.eventId) {
        next.eventId = "Selecione um evento.";
      }
      if (!form.category) next.category = "Selecione a categoria.";
      if (!form.clientId && form.origin !== "manual") next.clientId = "Selecione o cliente.";
      if (!form.description.trim()) next.description = "Informe a descrição.";
      if (amountNum <= 0) next.amount = "Informe um valor válido.";
      if (!isCompleteBrazilDate(form.revenueDate)) {
        next.revenueDate = "Informe a data no formato dd/mm/aaaa.";
      }
    }
    if (s === 2) {
      if (form.situation === "recebido_agora") {
        if (!isCompleteBrazilDate(form.receivedDate)) {
          next.receivedDate = "Informe a data no formato dd/mm/aaaa.";
        }
        if (form.isPartialReceipt && receivedNum <= 0) {
          next.receivedAmount = "Informe o valor recebido.";
        }
      }
      if (form.situation === "receber_depois" && !isCompleteBrazilDate(form.dueDate)) {
        next.dueDate = "Informe a data de vencimento no formato dd/mm/aaaa.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = (andNew: boolean) => {
    if (!validateStep(2)) return;
    const result = mockSaveRevenue({
      situation: form.situation,
      amount: amountNum,
      receivedAmount: receivedNum,
    });
    onSuccess?.(result.message);
    if (andNew) reset();
    else onClose();
  };

  const locked = form.fieldsLocked && form.origin === "agendamento";

  const step1 = (
    <BillingFormCard>
      <SettingsField label="Origem *">
        <SettingsDropdown
          aria-label="Origem da receita"
          options={[{ value: "", label: "Selecione a origem…" }, ...revenueOriginOptions]}
          value={form.origin}
          onSelect={(v) =>
            patch({
              origin: v as RevenueOriginKey,
              scheduleId: "",
              productId: "",
              eventId: "",
              fieldsLocked: true,
            })
          }
        />
        {errors.origin ? <p className="text-[12px] font-medium text-[#c41e3a]">{errors.origin}</p> : null}
      </SettingsField>

      {form.origin === "agendamento" ? (
        <SettingsField label="Agendamento *">
          <SearchableSelectDropdown
            aria-label="Agendamento"
            emptyLabel="Selecione um agendamento…"
            searchPlaceholder="Buscar cliente, serviço ou ID…"
            options={scheduleOptions.map((o) => ({ value: o.id, label: o.label }))}
            value={form.scheduleId}
            onSelect={(v) => applySchedule(v)}
          />
          {errors.scheduleId ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.scheduleId}</p>
          ) : null}
        </SettingsField>
      ) : null}

      {form.origin === "produto" ? (
        <SettingsField label="Produto (estoque) *">
          <SettingsDropdown
            aria-label="Produto"
            options={[
              { value: "", label: "Selecione…" },
              ...productOptions.map((o) => ({ value: o.id, label: o.label })),
            ]}
            value={form.productId}
            onSelect={(v) => applyProduct(v)}
          />
          {errors.productId ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.productId}</p>
          ) : null}
        </SettingsField>
      ) : null}

      {form.origin === "evento" ? (
        <SettingsField label="Evento *">
          <SettingsDropdown
            aria-label="Evento"
            options={[
              { value: "", label: "Selecione…" },
              ...eventOptions.map((o) => ({ value: o.id, label: o.label })),
            ]}
            value={form.eventId}
            onSelect={(v) => applyEvent(v)}
          />
          {errors.eventId ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.eventId}</p>
          ) : null}
        </SettingsField>
      ) : null}

      {form.origin === "agendamento" && form.scheduleId ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#fafbfc] px-3 py-2">
          <p className="text-[12px] text-neutral-600">Campos preenchidos pelo agendamento.</p>
          <button
            type="button"
            className={settingsOutlineButtonClass}
            onClick={() => patch({ fieldsLocked: !form.fieldsLocked })}
          >
            {form.fieldsLocked ? "Desbloquear edição" : "Bloquear edição"}
          </button>
        </div>
      ) : null}

      <SettingsField label="Categoria *">
        <SettingsDropdown
          aria-label="Categoria"
          options={[
            { value: "", label: "Selecione…" },
            ...REVENUE_CATEGORY_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
          ]}
          value={form.category}
          onSelect={(v) => patch({ category: v as RevenueCategoryKey })}
          disabled={locked}
        />
        {errors.category ? (
          <p className="text-[12px] font-medium text-[#c41e3a]">{errors.category}</p>
        ) : null}
      </SettingsField>

      <SettingsField label="Cliente">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <SearchableSelectDropdown
              aria-label="Cliente"
              emptyLabel="Selecione o cliente…"
              searchPlaceholder="Buscar cliente…"
              options={clientOptions}
              value={form.clientId}
              onSelect={(v) => patch({ clientId: v })}
              disabled={locked && Boolean(form.clientId)}
            />
          </div>
          <button
            type="button"
            className={settingsOutlineButtonClass}
            onClick={() => setNewClientOpen(true)}
          >
            <HiPlus className="h-4 w-4" />
            Novo
          </button>
        </div>
        {errors.clientId ? (
          <p className="text-[12px] font-medium text-[#c41e3a]">{errors.clientId}</p>
        ) : null}
      </SettingsField>

      <SettingsField label="Descrição *">
        <textarea
          rows={3}
          className={settingsTextareaClass}
          value={form.description}
          onChange={(e) => patch({ description: e.target.value })}
          disabled={locked}
          placeholder="Descrição da receita…"
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
            disabled={locked}
            placeholder="0,00"
          />
          {errors.amount ? (
            <p className="text-[12px] font-medium text-[#c41e3a]">{errors.amount}</p>
          ) : null}
        </SettingsField>
        <BillingDateInput
          label="Data da receita"
          value={form.revenueDate}
          onChange={(v) => patch({ revenueDate: v })}
          error={errors.revenueDate}
        />
      </div>
    </BillingFormCard>
  );

  const step2 = (
    <BillingFormCard>
      <SettingsField label="Situação *">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "recebido_agora", label: "Recebido agora" },
              { value: "receber_depois", label: "Receber depois" },
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

      {form.situation === "recebido_agora" ? (
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
            label="Data do recebimento"
            value={form.receivedDate}
            onChange={(v) => patch({ receivedDate: v })}
            error={errors.receivedDate}
          />
          <div className="flex items-center gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-3">
            <SettingsCheckbox
              checked={form.isPartialReceipt}
              onChange={(checked) =>
                patch({
                  isPartialReceipt: checked,
                  receivedAmount: checked ? form.receivedAmount : form.amount,
                })
              }
              aria-label="Recebimento parcial"
            />
            <div>
              <p className="text-[13px] font-semibold text-[#111]">Recebimento parcial</p>
              <p className="text-[12px] text-neutral-500">
                Desmarque para registrar recebimento total do valor informado.
              </p>
            </div>
          </div>
          {form.isPartialReceipt ? (
            <SettingsField label="Valor recebido *">
              <input
                type="text"
                inputMode="decimal"
                className={settingsInputClass}
                value={form.receivedAmount}
                onChange={(e) => patch({ receivedAmount: formatMoneyInput(e.target.value) })}
                placeholder="0,00"
              />
              {errors.receivedAmount ? (
                <p className="text-[12px] font-medium text-[#c41e3a]">{errors.receivedAmount}</p>
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
              rows={3}
              className={settingsTextareaClass}
              value={form.financialNote}
              onChange={(e) => patch({ financialNote: e.target.value })}
              placeholder="Condições, referência bancária…"
            />
          </SettingsField>
        </div>
      )}

      <BillingAttachmentField />
    </BillingFormCard>
  );

  const footer = (
    <DrawerFooterActions columns={newClientOpen ? 1 : 2}>
      <button type="button" onClick={onClose} className="btn-outline-sm bg-white">
        Cancelar
      </button>
      {newClientOpen ? null : step > 1 ? (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="btn-outline-sm bg-white"
        >
          Voltar
        </button>
      ) : null}
      {newClientOpen ? null : step < 2 ? (
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
            Salvar receita
          </button>
          <button type="button" onClick={() => save(true)} className="btn-outline-sm bg-white">
            Salvar e nova receita
          </button>
        </>
      )}
    </DrawerFooterActions>
  );

  const mainContent = newClientOpen ? (
    <BillingNewClientPanel
      categories={ClientsServiceMock.getKartCategories()}
      skillLevels={ClientsServiceMock.getSkillLevels()}
      onBack={() => setNewClientOpen(false)}
      onSuccess={(clientId, clientName) => {
        setExtraClients((prev) => [...prev, { value: clientId, label: clientName }]);
        patch({ clientId });
        setNewClientOpen(false);
      }}
    />
  ) : step === 1 ? (
    step1
  ) : (
    step2
  );

  return (
    <FinancialBillingDrawerShell
      open={open}
      onClose={onClose}
      title="Nova receita"
      subtitle="Registre qualquer receita em poucos passos, com impacto automático no caixa e na DRE."
      currentStep={step}
      hideSteps={newClientOpen}
      summary={
        <BillingSummaryPanel
          clientName={clientName}
          amount={amountNum}
          situationLabel={situationLabel}
        />
      }
      footer={footer}
    >
      {mainContent}
    </FinancialBillingDrawerShell>
  );
}
