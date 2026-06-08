export type VerificationCodeEmailKind = "register" | "password_recovery";

type Params = {
  kind: VerificationCodeEmailKind;
  firstName: string;
  code: string;
  expiresMinutes: number;
};

const TITLES: Record<VerificationCodeEmailKind, string> = {
  register: "Confirme seu cadastro — Gurgel Team",
  password_recovery: "Código para redefinir sua senha — Gurgel Team",
};

const INTROS: Record<VerificationCodeEmailKind, (name: string) => string> = {
  register: (name) =>
    `Olá${name ? `, ${name}` : ""}! Use o código abaixo para confirmar seu cadastro na área do aluno Gurgel Team.`,
  password_recovery: (name) =>
    `Olá${name ? `, ${name}` : ""}! Recebemos um pedido para redefinir a senha da sua conta. Use o código abaixo para continuar.`,
};

export function buildVerificationCodeEmail(params: Params): {
  subject: string;
  text: string;
  html: string;
} {
  const greetingName = params.firstName.trim();
  const subject = TITLES[params.kind];
  const intro = INTROS[params.kind](greetingName);

  const text = [
    intro,
    "",
    `Código: ${params.code}`,
    "",
    `Este código expira em ${params.expiresMinutes} minutos.`,
    "Se você não solicitou este e-mail, ignore esta mensagem.",
    "",
    "— Gurgel Team",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid rgba(17,17,17,0.08);overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 8px;">
                <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#c41e3a;">Gurgel Team</p>
                <h1 style="margin:12px 0 0;font-size:22px;line-height:1.3;color:#0d1f3c;">${subject.replace(" — Gurgel Team", "")}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 0;">
                <p style="margin:0;font-size:15px;line-height:1.6;color:#444;">${intro}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <div style="text-align:center;background:#f4f6f8;border-radius:12px;padding:20px 16px;">
                  <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#666;">Seu código</p>
                  <p style="margin:0;font-size:32px;font-weight:800;letter-spacing:0.28em;color:#0d1f3c;">${params.code}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <p style="margin:0;font-size:13px;line-height:1.5;color:#666;">Válido por <strong>${params.expiresMinutes} minutos</strong>. Não compartilhe este código com ninguém.</p>
                <p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:#888;">Se você não solicitou este e-mail, pode ignorá-lo com segurança.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
