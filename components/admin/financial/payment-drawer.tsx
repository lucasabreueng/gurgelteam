"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { HiXMark } from "react-icons/hi2";
import { getAppServices } from "@/lib/data-source/app-services";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { useFinanceMeta } from "@/lib/query/hooks/use-finance-meta";
import { queryKeys } from "@/lib/query/keys";
import { FinancialRepositoryMock } from "@/repositories/finance/FinancialRepositoryMock";

import { markPendingReceivablePaidForClient } from "@/lib/finance-runtime-store";

import { ACCOUNTS_RECEIVABLE } from "@/lib/admin-financial-mocks";

import { getBillingClientOptions } from "@/lib/admin-new-billing-mocks";

import { SettingsDropdown } from "../settings/settings-dropdown";

import {

  SettingsField,

  settingsInputClass,

  settingsTextareaClass,

} from "../settings/settings-section";

import {

  DRAWER_FOOTER_INNER_CLASS,

  DRAWER_FOOTER_SHELL_CLASS,

  DrawerFooterActions,

} from "@/components/ui/drawer-footer";



type Props = {

  open: boolean;

  onClose: () => void;

  onSuccess?: (message: string) => void;

};



export function PaymentDrawer({ open, onClose, onSuccess }: Props) {

  const { data: meta } = useFinanceMeta();

  const [clientId, setClientId] = useState("");

  const [serviceId, setServiceId] = useState("");

  const [methodId, setMethodId] = useState("pix");

  const [amount, setAmount] = useState("");

  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();
  useDrawerBodyLock(open);



  useEffect(() => {

    if (!open) return;

    setClientId("");

    setServiceId("");

    setMethodId("pix");

    setAmount("");

    setNotes("");

    const onKey = (e: KeyboardEvent) => {

      if (e.key === "Escape") onClose();

    };

    window.addEventListener("keydown", onKey);

    return () => {

      window.removeEventListener("keydown", onKey);

    };

  }, [open, onClose]);



  const paymentClientOptions = useMemo(() => {

    const fromMeta =

      meta?.paymentClientOptions ?? FinancialRepositoryMock.getPaymentClientOptions();

    return [

      ...fromMeta,

      ...getBillingClientOptions().filter(

        (c) => !fromMeta.some((existing) => existing.value === c.value),

      ),

    ];

  }, [meta?.paymentClientOptions]);



  const paymentServiceOptions =

    meta?.paymentServiceOptions ?? FinancialRepositoryMock.getPaymentServiceOptions();

  const paymentMethodOptions =

    meta?.paymentMethodOptions ?? FinancialRepositoryMock.getPaymentMethodOptions();



  const clientLabel =

    paymentClientOptions.find((c) => c.value === clientId)?.label ?? "";

  const canConfirm = Boolean(clientId && serviceId && amount.trim());



  const confirm = async () => {
    if (!canConfirm) return;

    const serviceLabel =
      paymentServiceOptions.find((s) => s.value === serviceId)?.label ?? "";
    const methodLabel =
      paymentMethodOptions.find((m) => m.value === methodId)?.label ?? "Pix";
    const paidAmount = parseFloat(amount.replace(",", "."));
    const amountCents = Number.isFinite(paidAmount)
      ? Math.round(paidAmount * 100)
      : 0;

    if (getDataSourceMode() === "http") {
      setSubmitting(true);
      try {
        const receivables = await getAppServices().finance.listReceivables({
          query: "",
          status: "",
          method: "",
          service: "",
        });
        const match =
          receivables.find(
            (row) =>
              row.clientId === clientId &&
              row.status !== "pago" &&
              (row.service === serviceLabel ||
                serviceLabel.toLowerCase().includes(row.service.toLowerCase())),
          ) ??
          receivables.find(
            (row) => row.clientId === clientId && row.status !== "pago",
          );
        if (!match) {
          onSuccess?.("Nenhum título pendente encontrado para este cliente.");
          return;
        }
        await getAppServices().finance.recordPayment({
          receivableId: match.id,
          amountCents: amountCents > 0 ? amountCents : 100,
          paidAt: new Date().toISOString(),
          method: methodLabel,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.finance.all,
        });
        onSuccess?.(
          `Pagamento registrado — ${clientLabel}, ${amount}. Conta a receber atualizada.`,
        );
        onClose();
      } catch {
        onSuccess?.("Erro ao registrar pagamento.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const updated = markPendingReceivablePaidForClient(
      ACCOUNTS_RECEIVABLE,
      clientId,
      serviceLabel,
      Number.isFinite(paidAmount) ? paidAmount : undefined,
    );

    onSuccess?.(
      updated
        ? `Pagamento registrado — ${clientLabel}, ${amount}. Conta a receber atualizada.`
        : `Pagamento registrado — ${clientLabel}, ${amount} (mock).`,
    );
    onClose();
  };

  if (!open) return null;



  return (

    <div className="fixed inset-0 z-[228] flex justify-end">

      <button

        type="button"

        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"

        aria-label="Fechar"

        onClick={onClose}

      />

      <aside

        role="dialog"

        aria-modal="true"

        aria-label="Registrar pagamento"

        className="app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[var(--ds-bg-panel)] shadow-2xl lg:max-w-[min(480px,92vw)]"

      >

        <header className="shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-5 py-4">

          <div className="flex items-start justify-between gap-3">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">

                Financeiro

              </p>

              <h1 className="text-xl font-bold text-[#0d1f3c]">

                Registrar pagamento

              </h1>

            </div>

            <button

              type="button"

              onClick={onClose}

              className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"

              aria-label="Fechar"

            >

              <HiXMark className="h-5 w-5" />

            </button>

          </div>

        </header>



        <div className="min-h-0 flex-1 overflow-y-auto p-5">

          <div className="space-y-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">

            <SettingsField label="Cliente">

              <SettingsDropdown

                aria-label="Cliente"

                options={[

                  { value: "", label: "Selecione o cliente…" },

                  ...paymentClientOptions,

                ]}

                value={clientId}

                onSelect={setClientId}

              />

            </SettingsField>



            <SettingsField label="Serviço">

              <SettingsDropdown

                aria-label="Serviço"

                options={[

                  { value: "", label: "Selecione o serviço…" },

                  ...paymentServiceOptions,

                ]}

                value={serviceId}

                onSelect={setServiceId}

              />

            </SettingsField>



            <SettingsField label="Valor (R$)">

              <input

                type="text"

                inputMode="decimal"

                placeholder="0,00"

                value={amount}

                onChange={(e) => setAmount(e.target.value)}

                className={settingsInputClass}

              />

            </SettingsField>



            <SettingsField label="Método de pagamento">

              <SettingsDropdown

                aria-label="Método de pagamento"

                options={paymentMethodOptions}

                value={methodId}

                onSelect={setMethodId}

              />

            </SettingsField>



            <SettingsField label="Observações">

              <textarea

                value={notes}

                onChange={(e) => setNotes(e.target.value)}

                rows={3}

                placeholder="Referência, parcelas, desconto…"

                className={settingsTextareaClass}

              />

            </SettingsField>



            <SettingsField label="Comprovante">

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center transition hover:border-accent/30">

                <span className="text-[11px] font-bold uppercase text-neutral-500">

                  Anexar comprovante

                </span>

                <span className="mt-1 text-xs text-neutral-400">

                  PNG, JPG ou PDF (mock)

                </span>

                <input type="file" className="sr-only" accept="image/*,.pdf" />

              </label>

            </SettingsField>

          </div>

        </div>



        <footer className={DRAWER_FOOTER_SHELL_CLASS}>

          <div className={DRAWER_FOOTER_INNER_CLASS}>

            <DrawerFooterActions columns={1}>

              <button

                type="button"

                onClick={confirm}

                disabled={!canConfirm || submitting}

                className="rounded-xl bg-[#0d1f3c] py-3 text-[10px] font-bold uppercase text-white shadow-md disabled:opacity-50"

              >

                Confirmar pagamento

              </button>

            </DrawerFooterActions>

          </div>

        </footer>

      </aside>

    </div>

  );

}

