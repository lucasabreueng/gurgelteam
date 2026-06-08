import type { ProfileDemoKey } from "@/lib/contracts/student/profile";
import type { StudentAccountBundle, StudentUserProfile } from "@/lib/contracts/student/profile";
import { getDataSourceMode } from "@/lib/data-source/mode";
import type { RegisterPilotFormValues } from "@/lib/register-pilot-mocks";
import { brazilDateToIso } from "@/lib/brazil-date-input";
import {
  mapPilotAccountBundle,
  mapPilotProfileToAccount,
  mapProfilePatchToApi,
} from "@/lib/student/map-pilot-profile-account";
import { RegisterPilotRepositoryMock } from "@/repositories/student/RegisterPilotRepositoryMock";
import { StudentProfileRepositoryHttp } from "@/repositories/student/StudentRepositoryHttp";
import { StudentProfileRepositoryMock } from "@/repositories/student/StudentProfileRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

/** Em HTTP, só usa mock quando `?demo=` está explícito na URL. */
export function shouldUseProfileMock(demoParam: string | null): boolean {
  if (!isHttpMode()) return true;
  return (
    demoParam === "piloto" || demoParam === "menor"
  );
}

export function createStudentProfileService() {
  const mock = StudentProfileRepositoryMock;

  return {
    getProfileCategories: mock.getProfileCategories,
    getProfileLevels: mock.getProfileLevels,
    getBrazilStates: mock.getBrazilStates,
    formatProfileName: mock.formatProfileName,
    getCategoryLabel: mock.getCategoryLabel,
    getLevelLabel: mock.getLevelLabel,
    shouldShowPilotData: mock.shouldShowPilotData,
    getAutoPilotCategory: mock.getAutoPilotCategory,
    getDisplayPilotCategory: mock.getDisplayPilotCategory,
    formatBirthDateDisplay: mock.formatBirthDateDisplay,
    formatBirthDateBrazil: mock.formatBirthDateBrazil,
    getProfileNavSections: mock.getProfileNavSections,
    formatPhoneBr: mock.formatPhoneBr,
    getAgeFromBirthDate: mock.getAgeFromBirthDate,
    isMinorProfile: mock.isMinorProfile,
    formatProfileAcceptedDate: mock.formatProfileAcceptedDate,
    formatProfileConsentDateTime: mock.formatProfileConsentDateTime,
    getSwitcherOptions: mock.getSwitcherOptions,
    formatCpf: mock.formatCpf,
    getRegisterPilotPath: RegisterPilotRepositoryMock.getRegisterPilotPath,
    getRelationshipDegreeOptions:
      RegisterPilotRepositoryMock.getRelationshipDegreeOptions,
    getRegisterPilotFieldErrors:
      RegisterPilotRepositoryMock.getRegisterPilotFieldErrors,
    hasRegisterPilotErrors: RegisterPilotRepositoryMock.hasRegisterPilotErrors,
    buildRegisterPilotUsername:
      RegisterPilotRepositoryMock.buildRegisterPilotUsername,

    getProfileAccount(demo: ProfileDemoKey): StudentAccountBundle {
      return mock.getProfileAccount(demo);
    },

    async fetchProfileAccount(
      demoParam: string | null,
    ): Promise<StudentAccountBundle> {
      if (shouldUseProfileMock(demoParam)) {
        const demo =
          demoParam === "piloto" || demoParam === "menor" ? demoParam : "piloto";
        return mock.getProfileAccount(demo);
      }

      const bundle = await StudentProfileRepositoryHttp.getAccount();
      return mapPilotAccountBundle(bundle);
    },

    async registerLinkedPilot(
      demoParam: string | null,
      guardianProfileId: string,
      form: RegisterPilotFormValues,
      username: string,
    ): Promise<StudentAccountBundle> {
      if (shouldUseProfileMock(demoParam)) {
        const demo =
          demoParam === "piloto" || demoParam === "menor" ? demoParam : "piloto";
        const base = mock.getProfileAccount(demo);
        const birthIso = brazilDateToIso(form.birthDate);
        const auto = mock.getAutoPilotCategory(birthIso ?? "");
        const newId = `pilot-${username.replace(/\./g, "-")}`;
        const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
        const newProfile: StudentUserProfile = {
          ...base.profiles[base.selfId],
          id: newId,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          birthDate: birthIso ?? "",
          cpf: mock.formatCpf(form.cpf),
          city: form.city.trim(),
          state: form.state.trim() || "DF",
          phone: mock.formatPhoneBr(form.phone),
          mainCategory: auto?.value ?? "cadete",
          email: `${username}@piloto-vinculado.local`,
          avatarUrl: form.avatarUrl || "/images/team-4.png",
        };
        const newCard = {
          profileId: newId,
          fullName,
          avatarUrl: newProfile.avatarUrl,
          category: auto?.label ?? "Cadete",
          level: "Iniciante",
          nextTraining: "Sem treino agendado",
          bestTime: "—",
        };
        return {
          ...base,
          linkedPilots: [...(base.linkedPilots ?? []), newCard],
          profiles: {
            ...base.profiles,
            [newId]: newProfile,
          },
        };
      }

      const bundle = await StudentProfileRepositoryHttp.registerLinkedPilot({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username,
        birthDate: form.birthDate,
        cpf: form.cpf,
        city: form.city.trim(),
        state: form.state.trim() || "DF",
        phone: form.phone,
        relationship: form.relationship,
        password: form.password,
        confirmPassword: form.confirmPassword,
        avatarUrl: form.avatarUrl.trim() || undefined,
      });
      return mapPilotAccountBundle(bundle);
    },

    async saveProfileAccount(
      demoParam: string | null,
      selfId: string,
      profileId: string,
      profiles: Record<string, StudentUserProfile>,
    ): Promise<StudentAccountBundle> {
      if (shouldUseProfileMock(demoParam)) {
        const demo =
          demoParam === "piloto" || demoParam === "menor" ? demoParam : "piloto";
        const base = mock.getProfileAccount(demo);
        return { ...base, profiles };
      }

      const profile = profiles[profileId];
      if (!profile) {
        throw new Error("Perfil não encontrado.");
      }

      const patch = mapProfilePatchToApi(profile);
      if (profileId === selfId) {
        await StudentProfileRepositoryHttp.updateProfile(patch);
      } else {
        await StudentProfileRepositoryHttp.updateLinkedProfile(profileId, patch);
      }

      const bundle = await StudentProfileRepositoryHttp.getAccount();
      return mapPilotAccountBundle(bundle);
    },

    async updateMediaConsent(
      demoParam: string | null,
      accepted: boolean,
    ): Promise<StudentAccountBundle> {
      if (shouldUseProfileMock(demoParam)) {
        const demo =
          demoParam === "piloto" || demoParam === "menor" ? demoParam : "piloto";
        const base = mock.getProfileAccount(demo);
        const profile = base.profiles[base.selfId];
        const now = mock.formatProfileConsentDateTime();
        return {
          ...base,
          profiles: {
            ...base.profiles,
            [base.selfId]: {
              ...profile,
              mediaConsentAccepted: accepted,
              mediaAcceptedAt: accepted ? now : "",
              mediaRevokedAt: accepted ? "" : now,
            },
          },
        };
      }

      const bundle = await StudentProfileRepositoryHttp.updateMediaConsent(accepted);
      return mapPilotAccountBundle(bundle);
    },

    async revokeSession(
      demoParam: string | null,
      profileId: string,
      sessionId: string,
    ): Promise<StudentAccountBundle> {
      if (shouldUseProfileMock(demoParam)) {
        const demo =
          demoParam === "piloto" || demoParam === "menor" ? demoParam : "piloto";
        const base = mock.getProfileAccount(demo);
        const profile = base.profiles[profileId];
        return {
          ...base,
          profiles: {
            ...base.profiles,
            [profileId]: {
              ...profile,
              sessions: profile.sessions.filter((s) => s.id !== sessionId),
            },
          },
        };
      }

      await StudentProfileRepositoryHttp.revokeSession(sessionId);
      const bundle = await StudentProfileRepositoryHttp.getAccount();
      return mapPilotAccountBundle(bundle);
    },
  };
}
