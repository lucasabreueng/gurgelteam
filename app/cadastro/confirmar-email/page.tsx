import { CadastroEmailConfirmPage } from "@/components/cadastro/cadastro-email-confirm-page";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ConfirmarEmailPage({ searchParams }: Props) {
  const params = await searchParams;
  return <CadastroEmailConfirmPage email={params.email ?? ""} />;
}
