export type EmailProvider = "resend" | "console";

export type EmailConfig = {
  provider: EmailProvider;
  from: string;
  resendApiKey?: string;
};

function resolveFromAddress(): string {
  const from =
    process.env.EMAIL_FROM?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    "Gurgel Team <noreply@gurgelteam.com.br>";
  return from;
}

export function getEmailConfig(): EmailConfig {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const forcedProvider = process.env.EMAIL_PROVIDER?.trim().toLowerCase();

  if (forcedProvider === "console") {
    return { provider: "console", from: resolveFromAddress() };
  }

  if (resendApiKey) {
    return {
      provider: "resend",
      from: resolveFromAddress(),
      resendApiKey,
    };
  }

  return { provider: "console", from: resolveFromAddress() };
}

export function isEmailConfiguredForProduction(): boolean {
  return getEmailConfig().provider === "resend";
}
