import { generateAvailableUsername } from "@/lib/auth-accounts-mocks";
import { formatCpf } from "@/lib/cadastro-mocks";
import {
  formatPhoneBr,
  getAutoPilotCategory,
  getCategoryLabel,
} from "@/lib/student-profile-mocks";

export { getAutoPilotCategory };

export const REGISTER_PILOT_PATH = "/piloto/perfil/cadastrar-piloto";

export const RELATIONSHIP_DEGREE_OPTIONS = [
  { value: "pai", label: "Pai" },
  { value: "mae", label: "Mãe" },
  { value: "avo", label: "Avô / Avó" },
  { value: "tio", label: "Tio / Tia" },
  { value: "irmao", label: "Irmão / Irmã" },
  { value: "outro", label: "Outro" },
] as const;

export type RegisterPilotFormValues = {
  firstName: string;
  lastName: string;
  relationship: string;
  birthDate: string;
  cpf: string;
  city: string;
  state: string;
  phone: string;
};

export type RegisterPilotFieldErrors = Partial<
  Record<keyof RegisterPilotFormValues | "category", string>
>;

export function getRegisterPilotFieldErrors(
  values: RegisterPilotFormValues
): RegisterPilotFieldErrors {
  const errors: RegisterPilotFieldErrors = {};

  if (!values.firstName.trim()) errors.firstName = "Informe o nome.";
  if (!values.lastName.trim()) errors.lastName = "Informe o sobrenome.";
  if (!values.relationship) {
    errors.relationship = "Selecione o grau de parentesco.";
  }
  if (!values.birthDate) {
    errors.birthDate = "Selecione a data de nascimento.";
  } else {
    const category = getAutoPilotCategory(values.birthDate);
    if (!category) {
      errors.birthDate =
        "O piloto deve ter mais de 6 anos para ser cadastrado.";
      errors.category = "Idade fora da faixa permitida.";
    }
  }

  const cpfDigits = values.cpf.replace(/\D/g, "");
  if (!cpfDigits) errors.cpf = "Informe o CPF.";
  else if (cpfDigits.length !== 11) errors.cpf = "CPF deve ter 11 dígitos.";

  if (!values.city.trim()) errors.city = "Informe a cidade.";
  if (!values.state) errors.state = "Selecione o estado.";

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (phoneDigits.length > 0 && phoneDigits.length < 10) {
    errors.phone = "Telefone incompleto.";
  }

  return errors;
}

export function hasRegisterPilotErrors(errors: RegisterPilotFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function buildRegisterPilotUsername(
  firstName: string,
  lastName: string
): string {
  return generateAvailableUsername(firstName, lastName);
}

export function getRelationshipLabel(value: string): string {
  return (
    RELATIONSHIP_DEGREE_OPTIONS.find((o) => o.value === value)?.label ?? value
  );
}

export { formatCpf, formatPhoneBr, getCategoryLabel };
