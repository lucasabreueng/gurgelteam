"use client";

import type { NewMaintenanceTypeKey, NewMaintenancePriority, MaintenanceOriginKey, OperationalStatusKey, DiagnosisAreaKey, DiagnosisAreaState, MaintenanceKartOption, PredictedPartLine, PlannedServiceKey } from "@/lib/contracts/maintenance";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { queryKeys } from "@/lib/query/keys";
import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";

import { MaintenanceHeader } from "./maintenance-header";
import { MaintenanceFooterActions } from "./maintenance-footer-actions";
import { KartSearchSelector } from "./kart-search-selector";
import { MaintenanceTypeSelector } from "./maintenance-type-selector";
import { PrioritySelector } from "./priority-selector";
import { MaintenanceOriginSelector } from "./maintenance-origin-selector";
import { ProblemReportSection } from "./problem-report-section";
import { InitialDiagnosisCard } from "./initial-diagnosis-card";
import { OperationalStatusCard } from "./operational-status-card";
import { PredictedPartsSection } from "./predicted-parts-section";
import { PlannedServicesSection } from "./planned-services-section";
import { EstimatedCostsCard } from "./estimated-costs-card";
import { MaintenanceMediaUploader } from "./maintenance-media-uploader";
import { OperationalImpactCard } from "./operational-impact-card";
import { TechnicalTimeline } from "./technical-timeline";
import { SmartMaintenanceAlerts } from "./smart-maintenance-alerts";
import { TechnicalSignature } from "./technical-signature";

const DEFAULT_PART_LINES: PredictedPartLine[] = [
  { partId: "p-corrente", quantity: 1 },
  { partId: "p-pinhao", quantity: 1 },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
};

export function NewMaintenanceModal({ open, onClose, onSuccess }: Props) {
  const [osNumber, setOsNumber] = useState(NewMaintenanceServiceMock.generateOsNumber);
  const [kart, setKart] = useState<MaintenanceKartOption | null>(null);
  const [maintType, setMaintType] = useState<NewMaintenanceTypeKey>("corretiva");
  const [priority, setPriority] = useState<NewMaintenancePriority>("alta");
  const [origin, setOrigin] = useState<MaintenanceOriginKey>("inspecao");
  const [problem, setProblem] = useState(NewMaintenanceServiceMock.getMockProblem());
  const [identifiedBy, setIdentifiedBy] = useState(NewMaintenanceServiceMock.getDefaultResponsible());
  const [session, setSession] = useState("Pós-treino — 21/05");
  const [diagnosis, setDiagnosis] = useState(NewMaintenanceServiceMock.buildInitialDiagnosis);
  const [operational, setOperational] =
    useState<OperationalStatusKey>("restrito");
  const [partLines, setPartLines] =
    useState<PredictedPartLine[]>(DEFAULT_PART_LINES);
  const [services, setServices] =
    useState<PlannedServiceKey[]>(NewMaintenanceServiceMock.getDefaultPlannedServices());
  const [returnEstimate, setReturnEstimate] = useState("24 mai 2026, 10:00");
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const reset = useCallback(() => {
    setOsNumber(NewMaintenanceServiceMock.generateOsNumber());
    setMaintType("corretiva");
    setPriority("alta");
    setOrigin("inspecao");
    setProblem(NewMaintenanceServiceMock.getMockProblem());
    setIdentifiedBy(NewMaintenanceServiceMock.getDefaultResponsible());
    setSession("Pós-treino — 21/05");
    setDiagnosis(NewMaintenanceServiceMock.buildInitialDiagnosis());
    setOperational("restrito");
    setPartLines(DEFAULT_PART_LINES);
    setServices(NewMaintenanceServiceMock.getDefaultPlannedServices());
    setReturnEstimate("24 mai 2026, 10:00");
    void getAppServices()
      .newMaintenance.getDefaultKart()
      .then((defaultKart) => setKart(defaultKart));
  }, []);

  useEffect(() => {
    if (!open) return;
    reset();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, reset]);

  const costs = useMemo(
    () => NewMaintenanceServiceMock.computeEstimatedCosts(partLines, services.length),
    [partLines, services.length]
  );

  const canCreate = Boolean(kart && problem.trim());

  const handleDiagnosisChange = (
    key: DiagnosisAreaKey,
    patch: Partial<DiagnosisAreaState>
  ) => {
    setDiagnosis((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const createOs = async (variant: "default" | "block" | "quote") => {
    if (!canCreate || !kart || saving) return;

    if (getDataSourceMode() === "http") {
      setSaving(true);
      try {
        const created = await getAppServices().maintenance.createOrder({
          kartId: kart.id,
          title: problem.trim(),
          description: [
            `Tipo: ${maintType}`,
            `Prioridade: ${priority}`,
            `Origem: ${origin}`,
            variant === "block" ? "Kart bloqueado na criação." : "",
            variant === "quote" ? "Orçamento solicitado ao cliente." : "",
          ]
            .filter(Boolean)
            .join(" · "),
          assignedTo: identifiedBy,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.maintenance.all,
        });
        const label = created
          ? `OS-${created.id.slice(0, 8).toUpperCase()}`
          : osNumber;
        onSuccess?.(`${label} criada para kart #${kart.number}.`);
        onClose();
      } catch {
        onSuccess?.("Erro ao criar ordem de manutenção.");
      } finally {
        setSaving(false);
      }
      return;
    }

    const msgs = {
      default: `${osNumber} criada para kart #${kart.number} (mock).`,
      block: `${osNumber} criada — kart #${kart.number} bloqueado e removido da agenda (mock).`,
      quote: `${osNumber} criada — orçamento enviado ao cliente (mock).`,
    };
    onSuccess?.(msgs[variant]);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[228] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Nova manutenção"
        className="relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl transition-transform duration-300 ease-out lg:max-w-[min(58vw,720px)]"
      >
        <MaintenanceHeader
          osNumber={osNumber}
          responsible={NewMaintenanceServiceMock.getDefaultResponsible()}
          dateTime={NewMaintenanceServiceMock.getNowLabel()}
          onSaveDraft={() =>
            onSuccess?.(`Rascunho ${osNumber} salvo (mock).`)
          }
          onCreate={() => void createOs("default")}
          onClose={onClose}
          createDisabled={!canCreate || saving}
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
          <div className="space-y-6">
            <KartSearchSelector selected={kart} onSelect={setKart} />
            <MaintenanceTypeSelector
              selected={maintType}
              onSelect={setMaintType}
            />
            <PrioritySelector selected={priority} onSelect={setPriority} />
            <MaintenanceOriginSelector
              selected={origin}
              onSelect={setOrigin}
            />
            <ProblemReportSection
              problem={problem}
              identifiedBy={identifiedBy}
              session={session}
              dateTime={NewMaintenanceServiceMock.getNowLabel()}
              onProblemChange={setProblem}
              onIdentifiedByChange={setIdentifiedBy}
              onSessionChange={setSession}
            />
            <InitialDiagnosisCard
              areas={diagnosis}
              onChange={handleDiagnosisChange}
            />
            <OperationalStatusCard
              selected={operational}
              onSelect={setOperational}
            />
            <PredictedPartsSection
              lines={partLines}
              onChange={setPartLines}
              onRequestPurchase={() =>
                onSuccess?.("Solicitação de compra enviada (mock).")
              }
            />
            <PlannedServicesSection
              selected={services}
              onChange={setServices}
            />
            <EstimatedCostsCard
              partsTotal={costs.partsTotal}
              labor={costs.labor}
              external={costs.external}
              total={costs.total}
              isClientKart={kart?.ownership === "client"}
              onGenerateQuote={() =>
                onSuccess?.("Orçamento gerado (mock).")
              }
              onSendApproval={() =>
                onSuccess?.("Aprovação enviada ao cliente (mock).")
              }
              onChargeClient={() =>
                onSuccess?.("Cobrança registrada (mock).")
              }
            />
            <MaintenanceMediaUploader />
            <OperationalImpactCard
              returnEstimate={returnEstimate}
              onReturnEstimateChange={setReturnEstimate}
            />
            <TechnicalTimeline />
            <SmartMaintenanceAlerts />
            <TechnicalSignature responsible={NewMaintenanceServiceMock.getDefaultResponsible()} />
          </div>
        </div>

        <MaintenanceFooterActions
          onCreate={() => createOs("default")}
          onCreateAndBlock={() => createOs("block")}
          onCreateAndQuote={() => createOs("quote")}
          onSaveDraft={() => onSuccess?.(`Rascunho ${osNumber} salvo (mock).`)}
          onCancel={onClose}
          createDisabled={!canCreate}
        />
      </aside>
    </div>
  );
}
