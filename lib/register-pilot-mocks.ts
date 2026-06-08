import { generateAvailableUsername } from "@/lib/auth-accounts-mocks";
import { brazilDateToIso, isCompleteBrazilDate } from "@/lib/brazil-date-input";
import { formatCpf } from "@/lib/cadastro-mocks";
import {
  formatPhoneBr,
  getAgeFromBirthDate,
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
  password: string;
  confirmPassword: string;
  avatarUrl: string;
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
    errors.birthDate = "Informe a data de nascimento.";
  } else if (!isCompleteBrazilDate(values.birthDate)) {
    errors.birthDate = "Informe uma data válida (dd/mm/aaaa).";
  } else {
    const birthIso = brazilDateToIso(values.birthDate);
    const age = getAgeFromBirthDate(birthIso);
    if (age === null) {
      errors.birthDate = "Informe uma data válida (dd/mm/aaaa).";
    } else if (age > 18) {
      errors.birthDate =
        "O piloto vinculado deve ter 18 anos ou menos.";
    } else {
      const category = getAutoPilotCategory(birthIso);
      if (!category) {
        errors.birthDate =
          "O piloto deve ter mais de 6 anos para ser cadastrado.";
        errors.category = "Idade fora da faixa permitida.";
      }
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

  if (!values.password) {
    errors.password = "Informe a senha de acesso.";
  } else if (values.password.length < 8) {
    errors.password = "A senha deve ter no mínimo 8 caracteres.";
  } else if (values.password.includes(" ")) {
    errors.password = "Senha não pode conter espaços.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirme a senha.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem.";
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
