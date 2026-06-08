import { getAppBaseUrl } from "@/lib/server/env";
import { buildTeamInviteEmail } from "@/lib/server/email/templates/team-invite-email";
import { sendEmail } from "@/lib/server/email/send-email";

const INVITE_EXPIRES_HOURS = 72;

export async function sendTeamInviteEmail(params: {
  to: string;
  firstName: string;
  resetToken: string;
}): Promise<void> {
  const baseUrl = getAppBaseUrl();
  const resetLink = `${baseUrl}/recuperar-senha/redefinir?token=${encodeURIComponent(params.resetToken)}`;
  const { subject, text, html } = buildTeamInviteEmail({
    firstName: params.firstName,
    resetLink,
    expiresHours: INVITE_EXPIRES_HOURS,
  });

  await sendEmail({
    to: params.to,
    subject,
    text,
    html,
  });
}

export { INVITE_EXPIRES_HOURS };
