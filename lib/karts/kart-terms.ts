import type { RegisteredMotor } from "@/lib/admin-karts-mocks";
import { REGISTERED_MOTORS } from "@/lib/admin-karts-mocks";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { SettingsRepositoryHttp } from "@/repositories/settings/SettingsRepositoryHttp";
import { SettingsRepositoryMock } from "@/repositories/settings/SettingsRepositoryMock";

export type RegisteredChassis = {
  id: string;
  name: string;
};

export async function loadKartMotorTerms(): Promise<RegisteredMotor[]> {
  if (getDataSourceMode() !== "http") {
    return [...REGISTERED_MOTORS];
  }
  const registry = await SettingsRepositoryHttp.getTermsRegistry();
  return registry.motors.map((motor) => ({
    id: motor.id,
    name: motor.name,
  }));
}

export async function loadKartChassisTerms(): Promise<RegisteredChassis[]> {
  if (getDataSourceMode() !== "http") {
    return SettingsRepositoryMock.getRegisteredChassisTerms().map((chassis) => ({
      id: chassis.id,
      name: chassis.name,
    }));
  }
  const registry = await SettingsRepositoryHttp.getTermsRegistry();
  return registry.chassis.map((chassis) => ({
    id: chassis.id,
    name: chassis.name,
  }));
}

export function resolveMotorName(
  motorId: string,
  motors: RegisteredMotor[],
): string {
  return motors.find((motor) => motor.id === motorId)?.name ?? motorId;
}

export function resolveChassisName(
  chassisId: string,
  chassisList: RegisteredChassis[],
): string {
  return (
    chassisList.find((chassis) => chassis.id === chassisId)?.name ?? chassisId
  );
}
