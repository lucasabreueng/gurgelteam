import type { StudentUserProfile } from "@/lib/contracts/student/profile";
import { getAutoPilotCategory } from "@/lib/student-profile-mocks";

export type ProfileCompletionItem = {
  id: string;
  label: string;
  done: boolean;
};

export function getProfileCompletionItems(
  profile: StudentUserProfile,
): ProfileCompletionItem[] {
  const categoryOk =
    Boolean(profile.mainCategory?.trim()) ||
    getAutoPilotCategory(profile.birthDate) !== null;

  return [
    {
      id: "category",
      label: "Categoria definida",
      done: categoryOk,
    },
    {
      id: "biometrics",
      label: "Peso e altura definidos",
      done: Boolean(profile.weightKg?.trim() && profile.heightCm?.trim()),
    },
    {
      id: "phone",
      label: "Telefone informado",
      done: Boolean(profile.phone?.replace(/\D/g, "").length >= 10),
    },
    {
      id: "emergency",
      label: "Contato de emergência",
      done: Boolean(
        profile.emergencyName?.trim() &&
          profile.emergencyPhone?.replace(/\D/g, "").length >= 10 &&
          profile.emergencyRelation?.trim(),
      ),
    },
  ];
}

export function getProfileCompletionPercent(
  items: ProfileCompletionItem[],
): number {
  if (items.length === 0) return 0;
  const done = items.filter((item) => item.done).length;
  return Math.round((done / items.length) * 100);
}
