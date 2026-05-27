"use client";

import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";
import type { ProfileDemoKey, ProfileId, StudentAccountBundle, StudentUserProfile } from "@/lib/contracts/student/profile";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

import { StudentShell } from "../student-shell";
import { ProfileSectionSaveActions } from "./profile-section-save";
import { ProfileSidebar } from "./profile-sidebar";
import { RegisterPilotDrawer } from "./register-pilot-drawer";
import {
  ProfileEmergencySection,
  ProfileGuardianReadonlySection,
  ProfileLinkedPilotsSection,
  ProfilePersonalSection,
  ProfilePilotSection,
  ProfilePreferencesSection,
  ProfileSecuritySection,
  ProfileTermsSection,
  isProfileSectionReadonly,
  shouldShowGuardianForProfile,
} from "./profile-sections";

function parseDemoParam(value: string | null): ProfileDemoKey {
  if (value === "piloto" || value === "menor" || value === "responsavel") return value;
  return "responsavel";
}

export function ProfilePage() {
  const searchParams = useSearchParams();
  const demo = parseDemoParam(searchParams.get("demo"));

  const [account, setAccount] = useState<StudentAccountBundle>(() =>
    StudentProfileServiceMock.getProfileAccount(demo)
  );
  const [activeId, setActiveId] = useState<ProfileId>(
    () => StudentProfileServiceMock.getProfileAccount(demo).selfId
  );
  const [activeSectionId, setActiveSectionId] = useState("profile-personal");
  const [registerPilotOpen, setRegisterPilotOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const next = StudentProfileServiceMock.getProfileAccount(demo);
    setAccount(next);
    setActiveId(next.selfId);
    setDirty(false);
  }, [demo]);

  const activeProfile = account.profiles[activeId];
  const showRegisterPilot = account.kind === "responsavel";

  const updateProfile = useCallback(
    (id: ProfileId, patch: Partial<StudentUserProfile>) => {
      setAccount((prev) => ({
        ...prev,
        profiles: {
          ...prev.profiles,
          [id]: { ...prev.profiles[id], ...patch },
        },
      }));
      setDirty(true);
    },
    []
  );

  const handleSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setDirty(false);
    }, 700);
  };

  const isGuardianView =
    account.kind === "responsavel" && activeId === account.selfId;
  const showLinkedPilots =
    isGuardianView && account.linkedPilots && account.linkedPilots.length > 0;
  const showGuardian = activeProfile
    ? shouldShowGuardianForProfile(activeProfile)
    : false;
  const showPilot = activeProfile ? StudentProfileServiceMock.shouldShowPilotData(activeProfile) : false;

  const navSections = useMemo(() => {
    if (!activeProfile) return [];
    return StudentProfileServiceMock.getProfileNavSections({
      showLinkedPilots: Boolean(showLinkedPilots),
      showGuardian,
      showPilot,
    });
  }, [activeProfile, showLinkedPilots, showGuardian, showPilot]);

  useEffect(() => {
    if (navSections.length === 0) return;
    setActiveSectionId((current) =>
      navSections.some((s) => s.id === current)
        ? current
        : navSections[0].id
    );
  }, [navSections, activeId]);

  if (!activeProfile) return null;

  const showSaveInHeader = !isProfileSectionReadonly(activeSectionId);
  const saveHeader = showSaveInHeader ? (
    <ProfileSectionSaveActions
      dirty={dirty}
      saving={saving}
      onSave={handleSave}
    />
  ) : undefined;

  const renderActiveSection = () => {
    switch (activeSectionId) {
      case "profile-linked":
        return showLinkedPilots && account.linkedPilots ? (
          <ProfileLinkedPilotsSection
            pilots={account.linkedPilots}
            onManage={(id) => {
              setActiveId(id);
              setActiveSectionId("profile-personal");
            }}
          />
        ) : null;
      case "profile-personal":
        return (
          <ProfilePersonalSection
            profile={activeProfile}
            onChange={(patch) => updateProfile(activeId, patch)}
            headerActions={saveHeader}
          />
        );
      case "profile-guardian":
        return showGuardian && activeProfile.guardian ? (
          <ProfileGuardianReadonlySection guardian={activeProfile.guardian} />
        ) : null;
      case "profile-pilot":
        return (
          <ProfilePilotSection
            profile={activeProfile}
            onChange={(patch) => updateProfile(activeId, patch)}
            headerActions={saveHeader}
          />
        );
      case "profile-security":
        return (
          <ProfileSecuritySection
            profile={activeProfile}
            onChange={(patch) => updateProfile(activeId, patch)}
            headerActions={saveHeader}
          />
        );
      case "profile-preferences":
        return (
          <ProfilePreferencesSection
            profile={activeProfile}
            onChange={(patch) => updateProfile(activeId, patch)}
            headerActions={saveHeader}
          />
        );
      case "profile-emergency":
        return (
          <ProfileEmergencySection
            profile={activeProfile}
            onChange={(patch) => updateProfile(activeId, patch)}
            headerActions={saveHeader}
          />
        );
      case "profile-terms":
        return (
          <ProfileTermsSection
            profile={activeProfile}
            onChange={(patch) => updateProfile(activeId, patch)}
            headerActions={saveHeader}
          />
        );
      default:
        return null;
    }
  };

  return (
    <StudentShell
      activeNav="dashboard"
      mobileTitle="Meu perfil"
      pageHeader={
        <AdminPageHeader
          title="Meu perfil"
          subtitle="Dados pessoais, preferências e configurações da sua conta"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {showRegisterPilot ? (
                <button
                  type="button"
                  onClick={() => setRegisterPilotOpen(true)}
                  className="btn-primary-md"
                >
                  Cadastrar piloto
                </button>
              ) : null}
              <Link href="/piloto" className="btn-outline-md">
                Voltar ao painel
              </Link>
            </div>
          }
        />
      }
      stackClassName="!gap-8"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <ProfileSidebar
          profile={activeProfile}
          navSections={navSections}
          activeSectionId={activeSectionId}
          onSectionSelect={setActiveSectionId}
          onAvatarChange={(avatarUrl) => updateProfile(activeId, { avatarUrl })}
        />

        <div className="min-w-0 flex-1 pb-4">{renderActiveSection()}</div>
      </div>

      <RegisterPilotDrawer
        open={registerPilotOpen}
        onClose={() => setRegisterPilotOpen(false)}
      />
    </StudentShell>
  );
}
