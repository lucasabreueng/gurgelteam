/**
 * Smoke test HTTP — login + endpoints principais da API v1.
 * Uso: npm run dev (em outro terminal) && npm run smoke:http
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.SMOKE_EMAIL ?? "ana.silva@gurgelteam.com.br";
const PASSWORD = process.env.SMOKE_PASSWORD ?? "Gurgel@123";

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: { message: string };
};

let sessionCookie = "";

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const headers = new Headers(init.headers);
  if (sessionCookie) headers.set("cookie", sessionCookie);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    sessionCookie = setCookie.split(";")[0] ?? sessionCookie;
  }

  const body = (await res.json()) as ApiEnvelope<T>;
  return { status: res.status, body };
}

function assertOk(label: string, status: number, body: ApiEnvelope<unknown>) {
  if (status >= 400 || !body.success) {
    throw new Error(
      `[FAIL] ${label} — HTTP ${status}: ${body.error?.message ?? "resposta inválida"}`,
    );
  }
  console.info(`[OK] ${label}`);
}

async function main() {
  console.info(`Smoke test em ${BASE_URL}`);

  const login = await request<{ userId: string }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier: EMAIL, password: PASSWORD }),
  });
  assertOk("POST /auth/login", login.status, login.body);

  const endpoints: { label: string; path: string }[] = [
    { label: "GET /auth/session", path: "/api/v1/auth/session" },
    { label: "GET /dashboard", path: "/api/v1/dashboard" },
    { label: "GET /finance/overview", path: "/api/v1/finance/overview" },
    { label: "GET /finance/receivables", path: "/api/v1/finance/receivables" },
    { label: "GET /finance/dre", path: "/api/v1/finance/dre?key=current-month" },
    {
      label: "GET /finance/cash-flow",
      path: "/api/v1/finance/cash-flow?key=current-month",
    },
    { label: "GET /finance/charts", path: "/api/v1/finance/charts" },
    { label: "GET /finance/insights", path: "/api/v1/finance/insights" },
    { label: "GET /inventory/parts", path: "/api/v1/inventory/parts" },
    { label: "GET /inventory/suppliers", path: "/api/v1/inventory/suppliers" },
    { label: "GET /inventory/stats", path: "/api/v1/inventory/stats" },
    {
      label: "GET /inventory/purchase-orders",
      path: "/api/v1/inventory/purchase-orders",
    },
    { label: "GET /inventory/history", path: "/api/v1/inventory/history" },
    { label: "GET /maintenance/orders", path: "/api/v1/maintenance/orders" },
    {
      label: "GET /maintenance/checklists/template",
      path: "/api/v1/maintenance/checklists/template",
    },
    {
      label: "GET /maintenance/inspections",
      path: "/api/v1/maintenance/inspections",
    },
    { label: "GET /settings/organization", path: "/api/v1/settings/organization" },
    { label: "GET /settings/users", path: "/api/v1/settings/users" },
    { label: "GET /team", path: "/api/v1/team?page=1" },
    { label: "GET /team/kpis", path: "/api/v1/team/kpis" },
    { label: "GET /settings/catalog", path: "/api/v1/settings/catalog" },
    { label: "GET /settings/notifications", path: "/api/v1/settings/notifications" },
    { label: "GET /settings/documents", path: "/api/v1/settings/documents" },
    { label: "GET /settings/terms-registry", path: "/api/v1/settings/terms-registry" },
    { label: "GET /telemetry/sessions", path: "/api/v1/telemetry/sessions" },
    { label: "GET /karts", path: "/api/v1/karts" },
    { label: "GET /clients", path: "/api/v1/clients" },
  ];

  for (const { label, path } of endpoints) {
    const res = await request<unknown>(path);
    assertOk(label, res.status, res.body);
  }

  console.info("\nSmoke test concluído com sucesso.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
