import {
  buildVerificationCodeEmail,
  type VerificationCodeEmailKind,
} from "@/lib/server/email/templates/verification-code-email";
import { sendEmail } from "@/lib/server/email/send-email";

type Params = {
  kind: VerificationCodeEmailKind;
  to: string;
  firstName: string;
  code: string;
  expiresMinutes: number;
};

export async function sendVerificationCodeEmail(params: Params): Promise<void> {
  const { subject, text, html } = buildVerificationCodeEmail({
    kind: params.kind,
    firstName: params.firstName,
    code: params.code,
    expiresMinutes: params.expiresMinutes,
  });

  await sendEmail({
    to: params.to,
    subject,
    text,
    html,
  });
}
