"use client";

import type { SettingsTabKey, KartCategory, SkillLevel, PlanCategory, NotificationEvent, NotificationChannel, RoleKey, PermissionKey } from "@/lib/contracts/settings";

import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import Image from "next/image";
import { useCallback, useState } from "react";

import { AuditLog } from "./audit-log";
import { IntegrationCard } from "./integration-card";
import { PermissionCard } from "./permission-card";
import { CategoriesLevelsPanel } from "./categories-levels-panel";
import { KartsPanel } from "./karts-panel";
import { PlansPackagesPanel } from "./plans-packages-panel";
import { ScheduleHoursPanel } from "./schedule-hours-panel";
import {
  SettingsField,
  SettingsSection,
  settingsInputClass,
  settingsTextareaClass,
} from "./settings-section";
import { SettingsToggle } from "./settings-toggle";

type Props = {
  activeTab: SettingsTabKey;
  onDirty: () => void;
};

function markDirty(onDirty: () => void) {
  onDirty();
}

function clonePlanCategories(data: PlanCategory[]): PlanCategory[] {
  return data.map((c) => ({
    ...c,
    plans: c.plans.map((p) => ({ ...p })),
  }));
}

function cloneLevels(levels: SkillLevel[]): SkillLevel[] {
  return levels.map((l) => ({
    ...l,
    categoryRequirements: l.categoryRequirements.map((r) => ({ ...r })),
  }));
}

export function SettingsTabContent({ activeTab, onDirty }: Props) {
  const [kartCategories, setKartCategories] = useState<KartCategory[]>(() =>
    SettingsServiceMock.getKartCategories().map((c) => ({ ...c }))
  );
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>(() =>
    cloneLevels(SettingsServiceMock.getSkillLevels())
  );
  const [planCategories, setPlanCategories] = useState<PlanCategory[]>(() =>
    clonePlanCategories(
      SettingsServiceMock.syncPlanCategoriesFromKart(SettingsServiceMock.getKartCategories(), SettingsServiceMock.getPlanCategories())
    )
  );

  const handleKartCategoriesChange = useCallback(
    (next: KartCategory[]) => {
      setKartCategories(next);
      setSkillLevels((prev) =>
        prev.map((l) => ({
          ...l,
          categoryRequirements: SettingsServiceMock.syncLevelRequirements(
            next,
            l.categoryRequirements
          ),
        }))
      );
      setPlanCategories((prev) => SettingsServiceMock.syncPlanCategoriesFromKart(next, prev));
      markDirty(onDirty);
    },
    [onDirty]
  );
  const [general, setGeneral] = useState({ ...SettingsServiceMock.getGeneralSettings() });
  const [roles, setRoles] = useState(SettingsServiceMock.getRoles().map((r) => ({ ...r, permissions: { ...r.permissions } })));
  const [karts, setKarts] = useState(() =>
    SettingsServiceMock.getSettingsKarts().map((k) => ({ ...k }))
  );
  const [feedbackScores, setFeedbackScores] = useState(
    Object.fromEntries(SettingsServiceMock.getFeedbackCriteria().map((c) => [c.id, c.defaultScore]))
  );
  const [notifications, setNotifications] = useState<NotificationEvent[]>(
    SettingsServiceMock.getNotificationEvents().map((e) => ({
      ...e,
      channels: { ...e.channels },
    }))
  );
  const [ranking, setRanking] = useState({ ...SettingsServiceMock.getRankingSettings() });
  const [appearance, setAppearance] = useState({ ...SettingsServiceMock.getAppearanceSettings() });

  const updateRolePerm = useCallback(
    (roleKey: RoleKey, perm: PermissionKey, value: boolean) => {
      setRoles((prev) =>
        prev.map((r) =>
          r.key === roleKey
            ? { ...r, permissions: { ...r.permissions, [perm]: value } }
            : r
        )
      );
      markDirty(onDirty);
    },
    [onDirty]
  );

  const toggleNotification = (
    eventId: string,
    channel: NotificationChannel,
    value: boolean
  ) => {
    setNotifications((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, channels: { ...e.channels, [channel]: value } }
          : e
      )
    );
    markDirty(onDirty);
  };

  switch (activeTab) {
    case "geral":
      return (
        <SettingsSection
          title="Geral"
          description="Identidade da equipe e canais de contato."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <SettingsField label="Nome da equipe">
              <input
                className={settingsInputClass}
                value={general.teamName}
                onChange={(e) => {
                  setGeneral((g) => ({ ...g, teamName: e.target.value }));
                  markDirty(onDirty);
                }}
              />
            </SettingsField>
            <SettingsField label="CNPJ">
              <input
                className={settingsInputClass}
                value={general.cnpj}
                onChange={(e) => {
                  setGeneral((g) => ({ ...g, cnpj: e.target.value }));
                  markDirty(onDirty);
                }}
              />
            </SettingsField>
            <SettingsField label="E-mail">
              <input
                type="email"
                className={settingsInputClass}
                value={general.email}
                onChange={(e) => {
                  setGeneral((g) => ({ ...g, email: e.target.value }));
                  markDirty(onDirty);
                }}
              />
            </SettingsField>
            <SettingsField label="WhatsApp">
              <input
                className={settingsInputClass}
                value={general.whatsapp}
                onChange={(e) => {
                  setGeneral((g) => ({ ...g, whatsapp: e.target.value }));
                  markDirty(onDirty);
                }}
              />
            </SettingsField>
            <SettingsField label="Instagram">
              <input
                className={settingsInputClass}
                value={general.instagram}
                onChange={(e) => {
                  setGeneral((g) => ({ ...g, instagram: e.target.value }));
                  markDirty(onDirty);
                }}
              />
            </SettingsField>
            <SettingsField label="Logo">
              <div className="flex items-center gap-4 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4">
                <Image
                  src={general.logo}
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
                <button
                  type="button"
                  className="rounded-xl border border-[rgba(13,31,60,0.15)] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]"
                  onClick={() => markDirty(onDirty)}
                >
                  Alterar logo
                </button>
              </div>
            </SettingsField>
            <div className="md:col-span-2">
              <SettingsField label="Endereço">
                <input
                  className={settingsInputClass}
                  value={general.address}
                  onChange={(e) => {
                    setGeneral((g) => ({ ...g, address: e.target.value }));
                    markDirty(onDirty);
                  }}
                />
              </SettingsField>
            </div>
            <div className="md:col-span-2">
              <SettingsField label="Texto institucional">
                <textarea
                  className={settingsTextareaClass}
                  value={general.institutionalText}
                  onChange={(e) => {
                    setGeneral((g) => ({ ...g, institutionalText: e.target.value }));
                    markDirty(onDirty);
                  }}
                />
              </SettingsField>
            </div>
          </div>
        </SettingsSection>
      );

    case "usuarios":
      return (
        <SettingsSection
          title="Usuários e permissões"
          description="Defina o que cada função pode fazer no painel."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {roles.map((role) => (
              <PermissionCard
                key={role.key}
                title={role.title}
                description={role.description}
                permissions={role.permissions}
                readOnly={role.key === "admin"}
                onChange={(perm, value) => updateRolePerm(role.key, perm, value)}
              />
            ))}
          </div>
        </SettingsSection>
      );

    case "horarios":
      return (
        <ScheduleHoursPanel
          kartCategories={kartCategories}
          skillLevels={skillLevels}
          onDirty={() => markDirty(onDirty)}
        />
      );

    case "planos":
      return (
        <PlansPackagesPanel
          categories={planCategories}
          onCategoriesChange={(next) => {
            setPlanCategories(next);
            markDirty(onDirty);
          }}
          onDirty={() => markDirty(onDirty)}
        />
      );

    case "categorias":
      return (
        <CategoriesLevelsPanel
          categories={kartCategories}
          onCategoriesChange={handleKartCategoriesChange}
          levels={skillLevels}
          onLevelsChange={(next) => {
            setSkillLevels(next);
            markDirty(onDirty);
          }}
          onDirty={() => markDirty(onDirty)}
        />
      );

    case "karts":
      return (
        <KartsPanel
          kartCategories={kartCategories}
          karts={karts}
          onKartsChange={setKarts}
          onDirty={() => markDirty(onDirty)}
        />
      );

    case "feedbacks":
      return (
        <SettingsSection
          title="Feedbacks"
          description="Modelos de avaliação técnica (escala 1 a 5)."
        >
          <ul className="grid gap-4 sm:grid-cols-2">
            {SettingsServiceMock.getFeedbackCriteria().map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-[#0d1f3c]">{c.label}</span>
                  <span className="text-lg font-bold tabular-nums text-accent">
                    {feedbackScores[c.id]}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={feedbackScores[c.id]}
                  onChange={(e) => {
                    setFeedbackScores((s) => ({
                      ...s,
                      [c.id]: Number(e.target.value),
                    }));
                    markDirty(onDirty);
                  }}
                  className="mt-3 h-2 w-full cursor-pointer accent-[#0d1f3c]"
                />
                <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
                  <span>1</span>
                  <span>5</span>
                </div>
              </li>
            ))}
          </ul>
        </SettingsSection>
      );

    case "notificacoes":
      return (
        <SettingsSection
          title="Notificações"
          description="Canais por tipo de evento."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(17,17,17,0.08)] text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="pb-3 pr-4">Evento</th>
                  {SettingsServiceMock.getNotificationChannels().map((ch) => (
                    <th key={ch.key} className="pb-3 px-2 text-center">
                      {ch.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notifications.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-[rgba(17,17,17,0.05)] last:border-0"
                  >
                    <td className="py-4 pr-4 font-medium text-[#111]">{event.label}</td>
                    {SettingsServiceMock.getNotificationChannels().map((ch) => (
                      <td key={ch.key} className="px-2 py-4 text-center">
                        <div className="flex justify-center">
                          <SettingsToggle
                            checked={event.channels[ch.key]}
                            onChange={(v) =>
                              toggleNotification(event.id, ch.key, v)
                            }
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SettingsSection>
      );

    case "integracoes":
      return (
        <SettingsSection title="Integrações" description="Conecte ferramentas externas.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SettingsServiceMock.getIntegrations().map((item) => (
              <IntegrationCard
                key={item.id}
                name={item.name}
                description={item.description}
                status={item.status}
                onConfigure={() => markDirty(onDirty)}
              />
            ))}
          </div>
        </SettingsSection>
      );

    case "seguranca":
      return (
        <SettingsSection title="Segurança" description="Conta e auditoria de acesso.">
          <ul className="grid gap-4 sm:grid-cols-2">
            {SettingsServiceMock.getSecurityCards().map((card) => (
              <li
                key={card.id}
                className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-5"
              >
                <h3 className="font-bold text-[#0d1f3c]">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm text-neutral-600">{card.description}</p>
                <button
                  type="button"
                  className="mt-4 rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white"
                  onClick={() => markDirty(onDirty)}
                >
                  Gerenciar
                </button>
              </li>
            ))}
          </ul>
        </SettingsSection>
      );

    case "aparencia":
      return (
        <SettingsSection title="Aparência" description="Identidade visual do painel.">
          <div className="grid gap-6 md:grid-cols-2">
            <SettingsField label="Cor principal">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={appearance.primaryColor}
                  onChange={(e) => {
                    setAppearance((a) => ({ ...a, primaryColor: e.target.value }));
                    markDirty(onDirty);
                  }}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-[rgba(17,17,17,0.1)]"
                />
                <input
                  className={settingsInputClass}
                  value={appearance.primaryColor}
                  onChange={(e) => {
                    setAppearance((a) => ({ ...a, primaryColor: e.target.value }));
                    markDirty(onDirty);
                  }}
                />
              </div>
            </SettingsField>
            <SettingsField label="Cor secundária">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={appearance.secondaryColor}
                  onChange={(e) => {
                    setAppearance((a) => ({ ...a, secondaryColor: e.target.value }));
                    markDirty(onDirty);
                  }}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-[rgba(17,17,17,0.1)]"
                />
                <input
                  className={settingsInputClass}
                  value={appearance.secondaryColor}
                  onChange={(e) => {
                    setAppearance((a) => ({ ...a, secondaryColor: e.target.value }));
                    markDirty(onDirty);
                  }}
                />
              </div>
            </SettingsField>
            <SettingsField label="Tema">
              <div className="flex gap-2">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setAppearance((a) => ({ ...a, theme: t }));
                      markDirty(onDirty);
                    }}
                    className={`rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider ${
                      appearance.theme === t
                        ? "bg-[#0d1f3c] text-white"
                        : "bg-white ring-1 ring-[rgba(17,17,17,0.1)] text-neutral-600"
                    }`}
                  >
                    {t === "light" ? "Claro" : "Escuro"}
                  </button>
                ))}
              </div>
            </SettingsField>
            <SettingsField label="Imagem padrão do painel">
              <div className="relative h-28 overflow-hidden rounded-xl ring-1 ring-[rgba(17,17,17,0.08)]">
                <Image
                  src={appearance.panelImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
            </SettingsField>
          </div>
        </SettingsSection>
      );

    case "ranking":
      return (
        <SettingsSection
          title="Ranking e resultados"
          description="Critérios de classificação e conquistas."
        >
          <div className="space-y-6">
            <SettingsField label="Critério de melhor volta">
              <input
                className={settingsInputClass}
                value={ranking.bestLapCriterion}
                onChange={(e) => {
                  setRanking((r) => ({ ...r, bestLapCriterion: e.target.value }));
                  markDirty(onDirty);
                }}
              />
            </SettingsField>
            <SettingsField label="Critério de consistência">
              <input
                className={settingsInputClass}
                value={ranking.consistencyCriterion}
                onChange={(e) => {
                  setRanking((r) => ({ ...r, consistencyCriterion: e.target.value }));
                  markDirty(onDirty);
                }}
              />
            </SettingsField>
            <ul className="divide-y divide-[rgba(17,17,17,0.06)] rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4">
              {(
                [
                  ["monthlyRanking", "Ranking mensal"],
                  ["generalRanking", "Ranking geral"],
                  ["championshipPoints", "Pontuação por campeonato"],
                  ["autoAchievements", "Conquistas automáticas"],
                ] as const
              ).map(([key, label]) => (
                <li key={key} className="py-1">
                  <SettingsToggle
                    label={label}
                    checked={ranking[key]}
                    onChange={(v) => {
                      setRanking((r) => ({ ...r, [key]: v }));
                      markDirty(onDirty);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </SettingsSection>
      );

    case "documentos":
      return (
        <SettingsSection title="Documentos" description="Modelos legais e institucionais.">
          <ul className="grid gap-4 sm:grid-cols-2">
            {SettingsServiceMock.getDocumentTemplates().map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[#0d1f3c]">{doc.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      doc.status === "publicado"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-neutral-600">{doc.description}</p>
                <p className="mt-3 text-[11px] text-neutral-500">
                  Atualizado · {doc.lastUpdated}
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-xl border border-[rgba(13,31,60,0.2)] py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]"
                  onClick={() => markDirty(onDirty)}
                >
                  Editar documento
                </button>
              </li>
            ))}
          </ul>
        </SettingsSection>
      );

    case "auditoria":
      return (
        <SettingsSection
          title="Auditoria"
          description="Histórico de alterações no painel."
        >
          <AuditLog entries={SettingsServiceMock.getAuditLog()} />
        </SettingsSection>
      );

    default:
      return null;
  }
}
