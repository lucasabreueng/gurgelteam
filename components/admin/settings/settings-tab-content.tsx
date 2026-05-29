"use client";

import type {
  SettingsTabKey,
  KartCategory,
  SkillLevel,
  CategoryPrice,
  NotificationEvent,
  NotificationChannel,
  SettingsUserAccount,
  DocumentTemplate,
} from "@/lib/contracts/settings";

import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { CategoriesLevelsPanel } from "./categories-levels-panel";
import { DocumentsPanel } from "./documents-panel";
import { PricesPanel } from "./prices-panel";
import { ScheduleHoursPanel } from "./schedule-hours-panel";
import {
  SettingsField,
  SettingsSection,
  settingsInputClass,
  settingsTextareaClass,
} from "./settings-section";
import { SettingsToggle } from "./settings-toggle";
import { UsersPermissionsPanel } from "./users-permissions-panel";

type Props = {
  activeTab: SettingsTabKey;
  onDirty: () => void;
};

function markDirty(onDirty: () => void) {
  onDirty();
}

function cloneCategoryPrices(data: CategoryPrice[]): CategoryPrice[] {
  return data.map((p) => ({ ...p }));
}

function LogoPreview({ src }: { src: string }) {
  if (!src) {
    return (
      <span className="text-sm font-medium text-neutral-400">
        Nenhum logotipo
      </span>
    );
  }
  if (src.startsWith("blob:") || src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Logo"
        className="h-10 w-auto max-w-[180px] object-contain"
      />
    );
  }
  return (
    <Image
      src={src}
      alt="Logo"
      width={120}
      height={40}
      className="h-10 w-auto"
    />
  );
}

function cloneLevels(levels: SkillLevel[]): SkillLevel[] {
  return levels.map((l) => ({
    ...l,
    categoryRequirements: l.categoryRequirements.map((r) => ({ ...r })),
  }));
}

function cloneSettingsUsers(users: SettingsUserAccount[]): SettingsUserAccount[] {
  return users.map((u) => ({
    ...u,
    modules: Object.fromEntries(
      Object.entries(u.modules).map(([key, perms]) => [key, { ...perms }])
    ) as SettingsUserAccount["modules"],
  }));
}

export function SettingsTabContent({ activeTab, onDirty }: Props) {
  const [kartCategories, setKartCategories] = useState<KartCategory[]>(() =>
    SettingsServiceMock.getKartCategories().map((c) => ({ ...c }))
  );
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>(() =>
    cloneLevels(SettingsServiceMock.getSkillLevels())
  );
  const [categoryPrices, setCategoryPrices] = useState<CategoryPrice[]>(() =>
    cloneCategoryPrices(
      SettingsServiceMock.syncCategoryPricesFromKart(
        SettingsServiceMock.getKartCategories(),
        SettingsServiceMock.getCategoryPrices()
      )
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
      setCategoryPrices((prev) =>
        SettingsServiceMock.syncCategoryPricesFromKart(next, prev)
      );
      markDirty(onDirty);
    },
    [onDirty]
  );

  const [general, setGeneral] = useState({
    ...SettingsServiceMock.getGeneralSettings(),
  });
  const [settingsUsers, setSettingsUsers] = useState<SettingsUserAccount[]>(
    () => cloneSettingsUsers(SettingsServiceMock.getSettingsUsers())
  );
  const [notifications, setNotifications] = useState<NotificationEvent[]>(
    SettingsServiceMock.getNotificationEvents().map((e) => ({
      ...e,
      channels: { ...e.channels },
    }))
  );
  const [documents, setDocuments] = useState<DocumentTemplate[]>(() =>
    SettingsServiceMock.getDocumentTemplates().map((d) => ({ ...d }))
  );
  const logoInputRef = useRef<HTMLInputElement>(null);

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
          <div className="grid gap-6">
            <SettingsField label="Logo">
              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4">
                <LogoPreview src={general.logo} />
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setGeneral((g) => ({ ...g, logo: url }));
                    markDirty(onDirty);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  className="rounded-xl border border-[rgba(13,31,60,0.15)] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]"
                  onClick={() => logoInputRef.current?.click()}
                >
                  Alterar logo
                </button>
                {general.logo ? (
                  <button
                    type="button"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-red-700"
                    onClick={() => {
                      setGeneral((g) => ({ ...g, logo: "" }));
                      markDirty(onDirty);
                    }}
                  >
                    Excluir logotipo
                  </button>
                ) : null}
              </div>
            </SettingsField>

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
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={general.whatsapp}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setGeneral((g) => ({ ...g, whatsapp: digits }));
                    markDirty(onDirty);
                  }}
                />
              </SettingsField>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
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
              <SettingsField label="TikTok">
                <input
                  className={settingsInputClass}
                  value={general.tiktok}
                  onChange={(e) => {
                    setGeneral((g) => ({ ...g, tiktok: e.target.value }));
                    markDirty(onDirty);
                  }}
                />
              </SettingsField>
              <SettingsField label="Facebook">
                <input
                  className={settingsInputClass}
                  value={general.facebook}
                  onChange={(e) => {
                    setGeneral((g) => ({ ...g, facebook: e.target.value }));
                    markDirty(onDirty);
                  }}
                />
              </SettingsField>
            </div>

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

            <SettingsField label="Texto institucional">
              <textarea
                className={settingsTextareaClass}
                value={general.institutionalText}
                onChange={(e) => {
                  setGeneral((g) => ({
                    ...g,
                    institutionalText: e.target.value,
                  }));
                  markDirty(onDirty);
                }}
              />
            </SettingsField>
          </div>
        </SettingsSection>
      );

    case "usuarios":
      return (
        <UsersPermissionsPanel
          users={settingsUsers}
          onUsersChange={setSettingsUsers}
          onDirty={() => markDirty(onDirty)}
        />
      );

    case "horarios":
      return (
        <ScheduleHoursPanel
          kartCategories={kartCategories}
          skillLevels={skillLevels}
          onDirty={() => markDirty(onDirty)}
        />
      );

    case "precos":
      return (
        <PricesPanel
          prices={categoryPrices}
          onPricesChange={setCategoryPrices}
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

    case "notificacoes":
      return (
        <SettingsSection
          title="Notificações"
          description="Canais por tipo de evento."
        >
          <div className="overflow-x-auto">
            <table className="hidden w-full min-w-[520px] text-left text-sm lg:table">
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
                    <td className="py-4 pr-4 font-medium text-[#111]">
                      {event.label}
                    </td>
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

            <div className="lg:hidden">
              <ul className="space-y-2">
                {notifications.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm"
                  >
                    <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
                      Evento
                    </p>
                    <p className="mt-1 text-[14px] font-semibold text-[#111]">
                      {event.label}
                    </p>
                    <div className="mt-3 space-y-2">
                      {SettingsServiceMock.getNotificationChannels().map((ch) => (
                        <div
                          key={ch.key}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-3 py-2"
                        >
                          <span className="text-[12px] font-semibold text-neutral-700">
                            {ch.label}
                          </span>
                          <SettingsToggle
                            checked={event.channels[ch.key]}
                            onChange={(v) =>
                              toggleNotification(event.id, ch.key, v)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SettingsSection>
      );

    case "documentos":
      return (
        <DocumentsPanel
          documents={documents}
          onDocumentsChange={setDocuments}
          onDirty={() => markDirty(onDirty)}
        />
      );

    default:
      return null;
  }
}
