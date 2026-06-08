import { generateAvailableUsername } from "@/lib/auth-accounts-mocks";
import { prisma } from "@/lib/server/prisma";

type Options = {
  /** Exclui a reserva do próprio e-mail (reenvio/atualização do cadastro). */
  excludeEmail?: string;
};

/** Usernames já em uso por contas ativas ou reservados em cadastros pendentes válidos. */
export async function listUnavailableUsernames(
  options: Options = {},
): Promise<string[]> {
  const now = new Date();
  const excludeEmail = options.excludeEmail?.trim().toLowerCase();

  const [users, pendings] = await Promise.all([
    prisma.user.findMany({ select: { username: true } }),
    prisma.pendingRegistration.findMany({
      where: {
        expiresAt: { gt: now },
        ...(excludeEmail ? { email: { not: excludeEmail } } : {}),
      },
      select: { reservedUsername: true },
    }),
  ]);

  return [
    ...users.map((user) => user.username),
    ...pendings.map((pending) => pending.reservedUsername),
  ];
}

export async function suggestAvailableUsername(
  firstName: string,
  lastName: string,
  options: Options = {},
): Promise<string> {
  const taken = await listUnavailableUsernames(options);
  return generateAvailableUsername(firstName, lastName, taken);
}

/** Reserva username único para um cadastro pendente (evita corrida entre confirmações). */
export async function reserveUsernameForRegistration(
  firstName: string,
  lastName: string,
  email: string,
): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const username = await suggestAvailableUsername(firstName, lastName, {
      excludeEmail: normalizedEmail,
    });
    if (!username) {
      throw new Error("Não foi possível gerar um usuário válido.");
    }

    const heldByOther = await prisma.pendingRegistration.findFirst({
      where: {
        reservedUsername: username,
        email: { not: normalizedEmail },
        expiresAt: { gt: new Date() },
      },
    });

    if (!heldByOther) {
      return username;
    }
  }

  throw new Error("Usuário indisponível no momento. Tente novamente.");
}
