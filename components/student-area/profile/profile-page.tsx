"use client";

import { getAppServices } from "@/lib/data-source/app-services";
import { usePilotProfileAccount } from "@/lib/query/hooks/use-pilot-profile";
import { shouldUseProfileMock } from "@/services/student/studentProfileService";
import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";
import type { ProfileDemoKey, ProfileId, StudentAccountBundle, StudentUserProfile } from "@/lib/contracts/student/profile";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

import { StudentShell } from "../student-shell";
import { ProfileSectionSaveActions } from "./profile-section-save";
import { ProfileHorizontalNav } from "./profile-horizontal-nav";
import { ProfileIdentityPanel } from "./profile-identity-panel";
import { ProfileInsightsPanel } from "./profile-insights-panel";
import { ProfileSwitcherModal } from "./profile-switcher-modal";
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
  isProfileSectionSaveable,
  shouldShowGuardianForProfile,
} from "./profile-sections";
import {
  getHeightCmError,
  getWeightKgError,
} from "@/lib/profile-field-formatters";
import { PageErrorState } from "@/components/ui/page-error-state";
import { StudentProfileSkeleton } from "./student-profile-skeleton";
import {
  PROFILE_GRID_CLASS,
  PROFILE_PANEL_CLASS,
  PROFILE_PANEL_SCROLL_CLASS,
} from "./profile-layout-classes";

function parseDemoParam(value: string | null): ProfileDemoKey | null {
  if (value === "piloto" || value === "menor") return value;
  return null;
}

export function ProfilePage() {
  const searchParams = useSearchParams();
  const demoParam = searchParams.get("demo");
  const demo = parseDemoParam(demoParam);
  const useMock = shouldUseProfileMock(demoParam);

  const {
    data: fetchedAccount,
    isPending: profileLoading,
    isError: profileError,
    refetch,
  } = usePilotProfileAccount(demoParam);

  const [account, setAccount] = useState<StudentAccountBundle | null>(() =>
    useMock && demo ? StudentProfileServiceMock.getProfileAccount(demo) : null,
  );
  const [activeId, setActiveId] = useState<ProfileId | null>(() =>
    useMock && demo ? StudentProfileServiceMock.getProfileAccount(demo).selfId : null,
  );
  const [activeSectionId, setActiveSectionId] = useState("profile-personal");
  const [registerPilotOpen, setRegisterPilotOpen] = useState(false);
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [bootLoading, setBootLoading] = useState(useMock);

  useEffect(() => {
    if (!fetchedAccount) return;
    setAccount(fetchedAccount);
    setActiveId((current) => {
      if (current && fetchedAccount.profiles[current]) return current;
      return fetchedAccount.selfId;
    });
    setDirty(false);
    setBootLoading(false);
  }, [fetchedAccount]);

  useEffect(() => {
    if (!useMock || !demo) return;
    setBootLoading(true);
    const next = StudentProfileServiceMock.getProfileAccount(demo);
    setAccount(next);
    setActiveId(next.selfId);
    setDirty(false);
    const id = window.setTimeout(() => setBootLoading(false), 280);
    return () => window.clearTimeout(id);
  }, [useMock, demo]);

  const updateProfile = useCallback(
    (id: ProfileId, patch: Partial<StudentUserProfile>) => {
      setAccount((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profiles: {
            ...prev.profiles,
            [id]: { ...prev.profiles[id], ...patch },
          },
        };
      });
      setDirty(true);
      setSaveError(null);
    },
    []
  );

  const handleSave = () => {
    if (!account || !activeId) return;
    const profile = account.profiles[activeId];
    if (!profile) return;

    const weightErr = getWeightKgError(profile.weightKg);
    const heightErr = getHeightCmError(profile.heightCm);
    if (weightErr || heightErr) {
      setSaveError(weightErr ?? heightErr ?? "Corrija os campos inválidos antes de salvar.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    void getAppServices()
      .studentProfile.saveProfileAccount(
        demoParam,
        account.selfId,
        activeId,
        account.profiles,
      )
      .then((next) => {
        setAccount(next);
        setActiveId((current) => current ?? next.selfId);
        setDirty(false);
      })
      .catch((error) => {
        setSaveError(
          error instanceof Error
            ? error.message
            : "Não foi possível salvar as alterações.",
        );
      })
      .finally(() => setSaving(false));
  };

  const handleMediaConsentChange = useCallback(
    async (accepted: boolean) => {
      const next = await getAppServices().studentProfile.updateMediaConsent(
        demoParam,
        accepted,
      );
      setAccount(next);
    },
    [demoParam],
  );

  const handleAvatarChange = useCallback(
    (avatarUrl: string) => {
      if (!activeId || !account) return;
      setAccount((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profiles: {
            ...prev.profiles,
            [activeId]: { ...prev.profiles[activeId], avatarUrl },
          },
          linkedPilots:
            activeId === prev.selfId || !prev.linkedPilots?.length
              ? prev.linkedPilots
              : prev.linkedPilots.map((pilot) =>
                  pilot.profileId === activeId ? { ...pilot, avatarUrl } : pilot,
                ),
        };
      });
    },
    [account, activeId],
  );

  const handleSelectProfile = useCallback((id: ProfileId) => {
    setActiveId(id);
    setActiveSectionId("profile-personal");
    setDirty(false);
    setSaveError(null);
  }, []);

  const handleRevokeSession = useCallback(
    async (sessionId: string) => {
      if (!activeId) return;
      const next = await getAppServices().studentProfile.revokeSession(
        demoParam,
        activeId,
        sessionId,
      );
      setAccount(next);
    },
    [activeId, demoParam],
  );

  const activeProfile =
    account && activeId ? account.profiles[activeId] : undefined;

  const isActiveMinor = activeProfile
    ? StudentProfileServiceMock.isMinorProfile(activeProfile)
    : false;

  const isManagingLinked = Boolean(
    account && activeId && activeId !== account.selfId,
  );

  const showLinkedPilotsTab = Boolean(
    activeProfile && !isActiveMinor && !isManagingLinked,
  );
  const showRegisterPilot =
    Boolean(activeProfile && !isActiveMinor && activeId === account?.selfId);
  const showGuardian = activeProfile
    ? shouldShowGuardianForProfile(activeProfile)
    : false;
  const showPilotTab = Boolean(
    activeProfile && StudentProfileServiceMock.shouldShowPilotData(activeProfile),
  );
  const navSections = useMemo(() => {
    if (!activeProfile) return [];
    return StudentProfileServiceMock.getProfileNavSections({
      showLinkedPilots: showLinkedPilotsTab,
      showGuardian,
      showPilot: showPilotTab,
    });
  }, [activeProfile, showLinkedPilotsTab, showGuardian, showPilotTab]);

  useEffect(() => {
    if (navSections.length === 0) return;
    setActiveSectionId((current) =>
      navSections.some((s) => s.id === current)
        ? current
        : navSections[0].id
    );
  }, [navSections, activeId]);

  const switcherOptions = useMemo(
    () => (account ? StudentProfileServiceMock.getSwitcherOptions(account) : []),
    [account],
  );

  const hasLinkedPilots = (account?.linkedPilots?.length ?? 0) > 0;
  const showProfileSwitcher =
    hasLinkedPilots && (!isActiveMinor || isManagingLinked);

  const mediaConsentProfile =
    isActiveMinor && account
      ? isManagingLinked
        ? account.profiles[account.selfId]
        : activeProfile
      : activeProfile;

  const activeLinkedPilot = useMemo(
    () =>
      isManagingLinked
        ? account?.linkedPilots?.find((p) => p.profileId === activeId) ?? null
        : null,
    [account?.linkedPilots, activeId, isManagingLinked],
  );

  if (profileError) {
    return (
      <StudentShell activeNav="dashboard" mobileTitle="Meu perfil">
        <PageErrorState onRetry={() => void refetch()} />
      </StudentShell>
    );
  }

  if (bootLoading || profileLoading || !account || !activeId || !activeProfile) {
    return (
      <StudentShell activeNav="dashboard" mobileTitle="Meu perfil">
        <StudentProfileSkeleton />
      </StudentShell>
    );
  }

  const showSaveInHeader = isProfileSectionSaveable(activeSectionId);
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
        return showLinkedPilotsTab ? (
          <ProfileLinkedPilotsSection
            pilots={account.linkedPilots ?? []}
            onManage={(id) => {
              handleSelectProfile(id);
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
        return showPilotTab ? (
          <ProfilePilotSection
            profile={activeProfile}
            onChange={(patch) => updateProfile(activeId, patch)}
            headerActions={saveHeader}
          />
        ) : null;
      case "profile-security":
        return (
          <ProfileSecuritySection
            profile={activeProfile}
            onRevokeSession={isManagingLinked ? undefined : handleRevokeSession}
            linkedClientId={isManagingLinked ? activeId : null}
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
            mediaConsentProfile={mediaConsentProfile}
            legalDocuments={account.legalDocuments}
            onChange={(patch) => updateProfile(activeId, patch)}
            onMediaConsentChange={
              useMock || isActiveMinor ? undefined : handleMediaConsentChange
            }
            readOnlyMediaConsent={isActiveMinor}
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
      disableTabletShell
      shellContentClassName="flex min-h-0 flex-1 flex-col lg:min-h-[calc(var(--app-vh,1vh)*100)]"
      mainClassName="flex min-h-0 flex-1 flex-col overflow-hidden lg:!flex-1 lg:min-h-0 lg:overflow-hidden"
      stackClassName="flex min-h-0 flex-1 flex-col"
      pageHeader={
        <AdminPageHeader
          title="Meu perfil"
          subtitle="Dados pessoais, preferências e configurações da sua conta"
          actions={
            showRegisterPilot ? (
              <button
                type="button"
                onClick={() => setRegisterPilotOpen(true)}
                className="btn-primary-md"
              >
                Cadastrar piloto
              </button>
            ) : undefined
          }
        />
      }
    >
      <div className={`${PROFILE_GRID_CLASS} min-h-0 flex-1`}>
          <ProfileIdentityPanel
            profile={activeProfile}
            profileClientId={activeId}
            onAvatarChange={handleAvatarChange}
            showProfileSwitcher={showProfileSwitcher}
            onOpenProfileSwitcher={() => setProfileSwitcherOpen(true)}
            isManagingLinked={isManagingLinked}
            linkedPilot={activeLinkedPilot}
          />

          <div className={`${PROFILE_PANEL_CLASS} min-h-0`}>
            <ProfileHorizontalNav
              sections={navSections}
              activeSectionId={activeSectionId}
              onSelect={setActiveSectionId}
            />
            <div
              role="tabpanel"
              id={`profile-panel-${activeSectionId}`}
              aria-labelledby={`profile-tab-${activeSectionId}`}
              className={`${PROFILE_PANEL_SCROLL_CLASS} p-6`}
            >
              {saveError ? (
                <p
                  className="mb-4 rounded-xl border border-[rgba(196,30,58,0.25)] bg-red-50 px-4 py-3 text-[13px] font-medium text-[#c41e3a]"
                  role="alert"
                >
                  {saveError}
                </p>
              ) : null}
              {renderActiveSection()}
            </div>
          </div>

          <ProfileInsightsPanel
            profile={activeProfile}
            isManagingLinked={isManagingLinked}
          />
      </div>

      <ProfileSwitcherModal
        open={profileSwitcherOpen}
        options={switcherOptions}
        activeId={activeId}
        onClose={() => setProfileSwitcherOpen(false)}
        onSelect={handleSelectProfile}
      />

      <RegisterPilotDrawer
        open={registerPilotOpen}
        guardianProfileId={account.selfId}
        demoParam={demoParam}
        onClose={() => setRegisterPilotOpen(false)}
        onSuccess={() => {
          void refetch().then((result) => {
            if (result.data) {
              setAccount(result.data);
              setActiveId(result.data.selfId);
              setActiveSectionId("profile-linked");
            }
          });
        }}
      />
    </StudentShell>
  );
}
