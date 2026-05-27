export type ErrorPageKey =
  | "404"
  | "401"
  | "403"
  | "500"
  | "sessao-expirada"
  | "manutencao";

export type ErrorPageAction = {
  label: string;
  href?: string;
  variant?: "primary" | "outline";
  /** Recarrega a página (500 / manutenção) */
  retry?: boolean;
  /** Estilo maiúsculo no botão outline (como o primário) */
  uppercase?: boolean;
};

export type ErrorPageConfig = {
  status: string;
  title: string;
  description: string;
  actions: ErrorPageAction[];
};

export const ERROR_PAGES: Record<ErrorPageKey, ErrorPageConfig> = {
  "404": {
    status: "404",
    title: "Página não encontrada",
    description:
      "O endereço que você acessou não existe ou foi movido. Verifique o link ou volte ao início.",
    actions: [{ label: "Ir para o início", href: "/", variant: "primary" }],
  },
  "401": {
    status: "401",
    title: "Acesso não autorizado",
    description:
      "É necessário fazer login para acessar esta página. Entre com sua conta ou crie um cadastro.",
    actions: [
      { label: "Fazer login", href: "/login", variant: "primary" },
      {
        label: "Criar cadastro",
        href: "/cadastro",
        variant: "outline",
        uppercase: true,
      },
    ],
  },
  "403": {
    status: "403",
    title: "Acesso negado",
    description:
      "Você não tem permissão para visualizar este conteúdo. Se acredita que isso é um engano, entre em contato com a equipe.",
    actions: [
      { label: "Ir para o início", href: "/", variant: "primary" },
      {
        label: "Área do aluno",
        href: "/piloto",
        variant: "outline",
        uppercase: true,
      },
    ],
  },
  "500": {
    status: "500",
    title: "Erro interno do servidor",
    description:
      "Algo inesperado aconteceu do nosso lado. Tente novamente em instantes ou volte mais tarde.",
    actions: [
      { label: "Tentar novamente", variant: "primary", retry: true },
      {
        label: "Ir para o início",
        href: "/",
        variant: "outline",
        uppercase: true,
      },
    ],
  },
  "sessao-expirada": {
    status: "Sessão expirada",
    title: "Sua sessão expirou",
    description:
      "Por segurança, sua sessão foi encerrada após um período de inatividade. Faça login novamente para continuar.",
    actions: [
      { label: "Fazer login", href: "/login", variant: "primary" },
      {
        label: "Ir para o início",
        href: "/",
        variant: "outline",
        uppercase: true,
      },
    ],
  },
  manutencao: {
    status: "503",
    title: "Em manutenção",
    description:
      "Estamos realizando melhorias no sistema. Voltaremos em breve — agradecemos a compreensão.",
    actions: [
      { label: "Atualizar página", variant: "primary", retry: true },
      {
        label: "Ir para o início",
        href: "/",
        variant: "outline",
        uppercase: true,
      },
    ],
  },
};
