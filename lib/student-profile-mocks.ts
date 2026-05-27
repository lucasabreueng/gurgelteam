/** Dados fictícios — Meu Perfil (área do piloto) */

import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCpf } from "@/lib/cadastro-mocks";

export type AccountRole = "piloto" | "responsavel";

export type ProfileId = string;

export type ActiveSession = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
};

export type GuardianInfo = {
  fullName: string;
  phone: string;
  email: string;
  relationship: string;
};

export type StudentUserProfile = {
  id: ProfileId;
  role: AccountRole;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  city: string;
  state: string;
  mainCategory: string;
  experienceLevel: string;
  favoriteNumber: string;
  weightKg: string;
  heightCm: string;
  notifyWhatsapp: boolean;
  notifyEmail: boolean;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  googleConnected: boolean;
  sessions: ActiveSession[];
  privacyAcceptedAt: string;
  termsAcceptedAt: string;
  /** Aceito no cadastro ou posteriormente no perfil */
  mediaConsentAccepted: boolean;
  mediaAcceptedAt: string;
  guardian?: GuardianInfo;
  /** Conta de responsável que também compete como piloto */
  alsoPilot?: boolean;
};

export type ProfileNavSection = {
  id: string;
  label: string;
};

export type LinkedPilotCard = {
  profileId: ProfileId;
  fullName: string;
  avatarUrl: string;
  category: string;
  nextTraining: string;
};

export type StudentAccountBundle = {
  kind: "piloto" | "responsavel";
  selfId: ProfileId;
  profiles: Record<ProfileId, StudentUserProfile>;
  linkedPilots?: LinkedPilotCard[];
};

export const PROFILE_CATEGORIES = [
  { value: "f400", label: "F400" },
  { value: "125cc", label: "125cc" },
  { value: "cadete", label: "Cadete" },
  { value: "mirim", label: "Mirim" },
];

export function formatProfileName(profile: {
  firstName: string;
  lastName: string;
}): string {
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
}

export function getCategoryLabel(value: string): string {
  if (!value) return "—";
  return PROFILE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function getLevelLabel(value: string): string {
  if (!value) return "—";
  return PROFILE_LEVELS.find((l) => l.value === value)?.label ?? value;
}

/** Exibe seção e dados de piloto (piloto ou responsável que também pilota) */
export function shouldShowPilotData(profile: StudentUserProfile): boolean {
  return profile.role === "piloto" || Boolean(profile.alsoPilot);
}

/**
 * Categoria automática pela idade:
 * — 7–8 anos: Mirim; 9–11: Cadete; acima de 11: F400
 */
export function getAutoPilotCategory(
  birthDate: string
): { value: string; label: string } | null {
  const age = getAgeFromBirthDate(birthDate);
  if (age === null) return null;
  if (age <= 6) return null;
  if (age > 11) return { value: "f400", label: "F400" };
  if (age > 8) return { value: "cadete", label: "Cadete" };
  return { value: "mirim", label: "Mirim" };
}

export function getDisplayPilotCategory(profile: StudentUserProfile): string {
  const auto = getAutoPilotCategory(profile.birthDate);
  if (auto) return auto.label;
  return getCategoryLabel(profile.mainCategory);
}

export function formatBirthDateDisplay(isoDate: string): string {
  if (!isoDate) return "—";
  const d = parseISO(isoDate);
  if (!isValid(d)) return isoDate;
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function getProfileNavSections(options: {
  showLinkedPilots: boolean;
  showGuardian: boolean;
  showPilot: boolean;
}): ProfileNavSection[] {
  const items: ProfileNavSection[] = [];
  if (options.showLinkedPilots) {
    items.push({ id: "profile-linked", label: "Pilotos vinculados" });
  }
  items.push({ id: "profile-personal", label: "Informações pessoais" });
  if (options.showGuardian) {
    items.push({ id: "profile-guardian", label: "Responsável" });
  }
  if (options.showPilot) {
    items.push({ id: "profile-pilot", label: "Dados do piloto" });
  }
  items.push(
    { id: "profile-security", label: "Segurança" },
    { id: "profile-preferences", label: "Preferências" },
    { id: "profile-emergency", label: "Emergência" },
    { id: "profile-terms", label: "Termos" }
  );
  return items;
}

export const PROFILE_LEVELS = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
  { value: "competidor", label: "Competidor" },
];

export const BRAZIL_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
].map((uf) => ({ value: uf, label: uf }));

export function formatPhoneBr(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function getAgeFromBirthDate(isoDate: string): number | null {
  if (!isoDate) return null;
  const birth = new Date(isoDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function isMinorProfile(profile: StudentUserProfile): boolean {
  const age = getAgeFromBirthDate(profile.birthDate);
  return age !== null && age < 14;
}

const SESSIONS_MOCK: ActiveSession[] = [
  {
    id: "s1",
    device: "Chrome · Windows",
    location: "Brasília, DF",
    lastActive: "Agora",
    current: true,
  },
  {
    id: "s2",
    device: "Safari · iPhone",
    location: "Brasília, DF",
    lastActive: "Há 2 dias",
  },
];

const GUARDIAN_INFO: GuardianInfo = {
  fullName: "Mariana Mendes",
  phone: "(61) 99876-5432",
  email: "mariana.mendes@email.com",
  relationship: "Mãe",
};

const PROFILE_DEFAULTS = {
  weightKg: "",
  heightCm: "",
  notifyWhatsapp: true,
  notifyEmail: true,
  googleConnected: true,
  sessions: SESSIONS_MOCK,
  privacyAcceptedAt: "12/03/2024",
  termsAcceptedAt: "12/03/2024",
  mediaConsentAccepted: false,
  mediaAcceptedAt: "",
} as const satisfies Partial<StudentUserProfile>;

function formatAcceptedDate(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

export { formatAcceptedDate as formatProfileAcceptedDate };

function baseProfile(
  partial: Partial<StudentUserProfile> & Pick<StudentUserProfile, "id">
): StudentUserProfile {
  return {
    ...PROFILE_DEFAULTS,
    ...partial,
  } as StudentUserProfile;
}

/** Conta piloto adulto (sem seletor de perfis) */
export const PILOT_ADULT_ACCOUNT: StudentAccountBundle = {
  kind: "piloto",
  selfId: "pilot-lucas",
  profiles: {
    "pilot-lucas": baseProfile({
      id: "pilot-lucas",
      role: "piloto",
      avatarUrl: "/images/team-6.png",
      firstName: "Lucas",
      lastName: "Mendes",
      heightCm: "178",
      email: "lucas.mendes@gurgelteam.com.br",
      phone: "(61) 99123-4567",
      birthDate: "1998-05-14",
      cpf: "123.456.789-09",
      city: "Brasília",
      state: "DF",
      mainCategory: "f400",
      experienceLevel: "avancado",
      favoriteNumber: "07",
      weightKg: "72",
      mediaConsentAccepted: true,
      mediaAcceptedAt: "12/03/2024",
      emergencyName: "Mariana Mendes",
      emergencyPhone: "(61) 99876-5432",
      emergencyRelation: "Mãe",
    }),
  },
};

/** Piloto menor de 14 anos — exibe card do responsável */
export const PILOT_MINOR_ACCOUNT: StudentAccountBundle = {
  kind: "piloto",
  selfId: "pilot-theo",
  profiles: {
    "pilot-theo": baseProfile({
      id: "pilot-theo",
      role: "piloto",
      avatarUrl: "/images/team-4.png",
      firstName: "Theo",
      lastName: "Mendes",
      email: "theo.mendes@email.com",
      phone: "(61) 99876-5432",
      birthDate: "2014-08-22",
      cpf: "987.654.321-00",
      city: "Brasília",
      state: "DF",
      mainCategory: "cadete",
      experienceLevel: "iniciante",
      favoriteNumber: "12",
      guardian: GUARDIAN_INFO,
      emergencyName: "Mariana Mendes",
      emergencyPhone: "(61) 99876-5432",
      emergencyRelation: "Mãe",
    }),
  },
};

/** Conta responsável com pilotos vinculados */
export const GUARDIAN_ACCOUNT: StudentAccountBundle = {
  kind: "responsavel",
  selfId: "guardian-mariana",
  linkedPilots: [
    {
      profileId: "pilot-theo",
      fullName: "Theo Mendes",
      avatarUrl: "/images/team-4.png",
      category: "Cadete",
      nextTraining: "Sáb., 24 mai · 14:30",
    },
    {
      profileId: "pilot-lara",
      fullName: "Lara Mendes",
      avatarUrl: "/images/team-2.png",
      category: "Mirim",
      nextTraining: "Dom., 25 mai · 10:00",
    },
  ],
  profiles: {
    "guardian-mariana": baseProfile({
      id: "guardian-mariana",
      role: "responsavel",
      alsoPilot: true,
      avatarUrl: "/images/team-1.png",
      firstName: "Mariana",
      lastName: "Mendes",
      email: "mariana.mendes@email.com",
      phone: "(61) 99876-5432",
      birthDate: "1985-03-10",
      cpf: "456.789.123-00",
      city: "Brasília",
      state: "DF",
      mainCategory: "f400",
      experienceLevel: "intermediario",
      favoriteNumber: "15",
      googleConnected: false,
      emergencyName: "Carlos Mendes",
      emergencyPhone: "(61) 98765-4321",
      emergencyRelation: "Cônjuge",
    }),
    "pilot-theo": baseProfile({
      id: "pilot-theo",
      role: "piloto",
      avatarUrl: "/images/team-4.png",
      firstName: "Theo",
      lastName: "Mendes",
      email: "theo.mendes@email.com",
      phone: "(61) 99876-5432",
      birthDate: "2014-08-22",
      cpf: "987.654.321-00",
      city: "Brasília",
      state: "DF",
      mainCategory: "cadete",
      experienceLevel: "iniciante",
      favoriteNumber: "12",
      guardian: GUARDIAN_INFO,
      emergencyName: "Mariana Mendes",
      emergencyPhone: "(61) 99876-5432",
      emergencyRelation: "Mãe",
    }),
    "pilot-lara": baseProfile({
      id: "pilot-lara",
      role: "piloto",
      avatarUrl: "/images/team-2.png",
      firstName: "Lara",
      lastName: "Mendes",
      email: "lara.mendes@email.com",
      phone: "(61) 99876-5432",
      birthDate: "2016-11-05",
      cpf: "111.222.333-44",
      city: "Brasília",
      state: "DF",
      mainCategory: "mirim",
      experienceLevel: "iniciante",
      favoriteNumber: "03",
      guardian: GUARDIAN_INFO,
      emergencyName: "Mariana Mendes",
      emergencyPhone: "(61) 99876-5432",
      emergencyRelation: "Mãe",
    }),
  },
};

export type ProfileDemoKey = "responsavel" | "piloto" | "menor";

export function getProfileAccount(demo: ProfileDemoKey = "responsavel"): StudentAccountBundle {
  switch (demo) {
    case "piloto":
      return structuredClone(PILOT_ADULT_ACCOUNT);
    case "menor":
      return structuredClone(PILOT_MINOR_ACCOUNT);
    default:
      return structuredClone(GUARDIAN_ACCOUNT);
  }
}

export function getSwitcherOptions(account: StudentAccountBundle) {
  if (account.kind !== "responsavel" || !account.linkedPilots) return [];
  const self = account.profiles[account.selfId];
  return [
    {
      id: account.selfId,
      label: formatProfileName(self),
      sublabel: "Responsável",
      avatarUrl: self.avatarUrl,
      role: "responsavel" as const,
    },
    ...account.linkedPilots.map((p) => ({
      id: p.profileId,
      label: p.fullName,
      sublabel: p.category,
      avatarUrl: p.avatarUrl,
      role: "piloto" as const,
    })),
  ];
}

export { formatCpf };
