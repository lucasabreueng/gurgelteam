/**
 * Checklist MIGRATION_STATUS §2.3 + domínios migrados + escritas HTTP.
 * Uso: npm run smoke:setup && npm run smoke:checklist
 */
import { SMOKE_FIXTURES } from "./smoke-fixtures";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const IDENTIFIER = process.env.SMOKE_EMAIL ?? "ana.silva@gurgelteam.com.br";
const PASSWORD = process.env.SMOKE_PASSWORD ?? "Gurgel@123";

/** PNG 1×1 mínimo para upload de mídia. */
const SMOKE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVRQI2P8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

type ApiEnvelope<T> = { success: boolean; data?: T; error?: { message: string } };

let cookie = "";

async function api<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const headers = new Headers(init.headers);
  if (cookie) headers.set("cookie", cookie);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0] ?? cookie;
  return { status: res.status, body: (await res.json()) as ApiEnvelope<T> };
}

async function apiForm<T>(
  path: string,
  formData: FormData,
): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  const res = await fetch(`${BASE}${path}`, { method: "POST", body: formData, headers });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0] ?? cookie;
  return { status: res.status, body: (await res.json()) as ApiEnvelope<T> };
}

function ok(label: string, status: number, body: ApiEnvelope<unknown>) {
  if (status >= 400 || !body.success) {
    throw new Error(`[FAIL] ${label} — HTTP ${status}: ${body.error?.message ?? "erro"}`);
  }
  console.info(`[OK] ${label}`);
}

function fail(label: string, message: string): never {
  throw new Error(`[FAIL] ${label} — ${message}`);
}

const LESSON_ACTIVE_STATUSES = new Set([
  "aguardando",
  "em_andamento",
  "pendente_registro",
]);

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.info(`Checklist HTTP em ${BASE}\n`);

  const login = await api("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier: IDENTIFIER, password: PASSWORD }),
  });
  ok("Login admin", login.status, login.body);

  const checks: [string, string][] = [
    ["Agenda meta", "/api/v1/schedule/meta"],
    ["Agenda eventos", "/api/v1/schedule/events"],
    ["Agenda upcoming-days", "/api/v1/schedule/upcoming-days"],
    ["Grade semanal", "/api/v1/schedule/week"],
    ["Aulas sessions", `/api/v1/lessons/sessions?date=${today}`],
    ["Clientes lista", "/api/v1/clients"],
    ["Clientes rankings", "/api/v1/clients/rankings"],
    ["Karts paddock", "/api/v1/karts/paddock"],
    ["Finance overview", "/api/v1/finance/overview"],
    ["Finance DRE", "/api/v1/finance/dre?key=current-month"],
    ["Finance cash-flow", "/api/v1/finance/cash-flow?key=current-month"],
    ["Finance charts", "/api/v1/finance/charts"],
    ["Finance insights", "/api/v1/finance/insights"],
    ["Finance meta", "/api/v1/finance/meta"],
    ["Estoque parts", "/api/v1/inventory/parts"],
    ["Estoque movements", "/api/v1/inventory/movements"],
    ["Estoque purchase-orders", "/api/v1/inventory/purchase-orders"],
    ["Estoque history", "/api/v1/inventory/history"],
    ["Estoque charts", "/api/v1/inventory/charts"],
    ["Manutenção orders", "/api/v1/maintenance/orders"],
    ["Manutenção checklist template", "/api/v1/maintenance/checklists/template"],
    ["Manutenção inspection template", "/api/v1/maintenance/inspections/template"],
    ["Manutenção inspections", "/api/v1/maintenance/inspections"],
    ["Settings organization", "/api/v1/settings/organization"],
    ["Settings users", "/api/v1/settings/users"],
    ["Equipe lista", "/api/v1/team?page=1"],
    ["Equipe KPIs", "/api/v1/team/kpis"],
    ["Settings catalog", "/api/v1/settings/catalog"],
    ["Settings notifications", "/api/v1/settings/notifications"],
    ["Settings documents", "/api/v1/settings/documents"],
    ["Settings terms registry", "/api/v1/settings/terms-registry"],
    ["Settings integrations", "/api/v1/settings/integrations"],
    ["Settings appearance", "/api/v1/settings/appearance"],
    ["Settings security", "/api/v1/settings/security"],
    ["Manutenção checklist context", "/api/v1/maintenance/checklists/context"],
    ["Telemetria sessions", "/api/v1/telemetry/sessions"],
    ["Dashboard", "/api/v1/dashboard"],
  ];

  for (const [label, path] of checks) {
    const res = await api<unknown>(path);
    ok(label, res.status, res.body);
  }

  const clients = await api<{ id: string }[]>("/api/v1/clients");
  ok("Clientes lista (data)", clients.status, clients.body);
  const clientId = clients.body.data?.[0]?.id;
  if (clientId) {
    for (const [label, path] of [
      ["Cliente stats", `/api/v1/clients/${clientId}/stats`],
      ["Cliente timeline", `/api/v1/clients/${clientId}/timeline`],
    ] as const) {
      const res = await api<unknown>(path);
      ok(label, res.status, res.body);
    }
  }

  const sessions = await api<{ id: string }[]>("/api/v1/telemetry/sessions");
  ok("Telemetria sessions (data)", sessions.status, sessions.body);
  const sessionId = sessions.body.data?.[0]?.id;
  if (sessionId) {
    const detail = await api(`/api/v1/telemetry/sessions/${sessionId}`);
    ok("Telemetria session detail", detail.status, detail.body);
  }

  const paddock = await api<{ boxes: { kartId?: string }[] }>("/api/v1/karts/paddock");
  ok("Karts paddock (write prep)", paddock.status, paddock.body);
  const kartId =
    paddock.body.data?.boxes?.find((b) => b.kartId)?.kartId ??
    SMOKE_FIXTURES.kart12Id;
  let orderId: string | undefined;

  if (kartId) {
    const createOs = await api<{ id: string }>("/api/v1/maintenance/orders", {
      method: "POST",
      body: JSON.stringify({
        kartId,
        title: "Smoke OS",
        description: "Criada pelo smoke-checklist",
      }),
    });
    ok("POST manutenção OS", createOs.status, createOs.body);
    orderId = createOs.body.data?.id;
    if (orderId) {
      const patchOs = await api(`/api/v1/maintenance/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "em_andamento" }),
      });
      ok("PATCH manutenção OS", patchOs.status, patchOs.body);
      const orderDetail = await api(`/api/v1/maintenance/orders/${orderId}`);
      ok("GET manutenção OS detail", orderDetail.status, orderDetail.body);
      const checklistPut = await api(
        `/api/v1/maintenance/orders/${orderId}/checklist`,
        {
          method: "PUT",
          body: JSON.stringify({
            checklistData: {
              groups: [
                {
                  title: "Smoke checklist",
                  items: [
                    { id: "pneus", label: "Pneus", status: "ok" },
                    { id: "freios", label: "Freios", status: "warn" },
                  ],
                },
              ],
            },
          }),
        },
      );
      ok("PUT checklist OS", checklistPut.status, checklistPut.body);
    }

    const createInspection = await api("/api/v1/maintenance/inspections", {
      method: "POST",
      body: JSON.stringify({
        kartId,
        checklistType: "pre_treino",
        payload: { items: {}, diagnosis: "Smoke", generalCondition: "atencao" },
        overallStatus: "liberado",
        signedBy: "Smoke Bot",
      }),
    });
    ok("POST inspeção", createInspection.status, createInspection.body);
  }

  const parts = await api<{ id: string; stockQty: number }[]>("/api/v1/inventory/parts");
  ok("Estoque parts (write prep)", parts.status, parts.body);
  const partId = parts.body.data?.[0]?.id;
  if (partId) {
    const movement = await api("/api/v1/inventory/movements", {
      method: "POST",
      body: JSON.stringify({
        inventoryPartId: partId,
        type: "entrada",
        qty: 1,
        notes: "Smoke checklist",
      }),
    });
    ok("POST movimentação estoque", movement.status, movement.body);
  }

  const mediaForm = new FormData();
  mediaForm.append(
    "file",
    new Blob([SMOKE_PNG], { type: "image/png" }),
    "smoke.png",
  );
  mediaForm.append("label", "Smoke upload");
  const mediaUpload = await apiForm<{ id: string; url: string }>(
    "/api/v1/maintenance/inspections/media",
    mediaForm,
  );
  ok("POST mídia inspeção", mediaUpload.status, mediaUpload.body);

  const slotBase = new Date();
  slotBase.setDate(slotBase.getDate() + 3);
  const uniqueHour = 8 + (Date.now() % 10);
  const uniqueMinute = Date.now() % 60;
  slotBase.setHours(uniqueHour, uniqueMinute, 0, 0);
  const slotEndBase = new Date(slotBase.getTime() + 60 * 60 * 1000);

  const createEvent = await api<{ id: string }>("/api/v1/schedule/events", {
    method: "POST",
    body: JSON.stringify({
      startsAt: slotBase.toISOString(),
      endsAt: slotEndBase.toISOString(),
      type: "treino_livre",
      clientId: clientId ?? SMOKE_FIXTURES.clientLucasId,
      kartId,
    }),
  });
  ok("POST agenda evento", createEvent.status, createEvent.body);
  const smokeEventId = createEvent.body.data?.id;
  if (smokeEventId) {
    const rescheduleStart = new Date(slotBase.getTime() + 2 * 60 * 60 * 1000);
    const rescheduleEnd = new Date(rescheduleStart.getTime() + 60 * 60 * 1000);
    const reschedule = await api(
      `/api/v1/schedule/events/${smokeEventId}/reschedule`,
      {
        method: "POST",
        body: JSON.stringify({
          startsAt: rescheduleStart.toISOString(),
          endsAt: rescheduleEnd.toISOString(),
          reason: "Smoke reschedule",
        }),
      },
    );
    if (reschedule.status === 409) {
      console.info("[SKIP] POST agenda reschedule — conflito de kart/horário");
    } else {
      ok("POST agenda reschedule", reschedule.status, reschedule.body);
    }

    const altKartId =
      paddock.body.data?.boxes?.find(
        (b) => b.kartId && b.kartId !== kartId,
      )?.kartId ?? kartId;
    if (altKartId !== kartId) {
      const swapKart = await api(
        `/api/v1/schedule/events/${smokeEventId}/swap-kart`,
        {
          method: "POST",
          body: JSON.stringify({
            kartId: altKartId,
            reason: "Smoke swap-kart",
          }),
        },
      );
      if (swapKart.status === 409) {
        console.info("[SKIP] POST agenda swap-kart — conflito de kart/horário");
      } else {
        ok("POST agenda swap-kart", swapKart.status, swapKart.body);
      }
    } else {
      console.info("[SKIP] swap-kart — apenas um kart disponível no paddock");
    }

    const confirmEvent = await api(
      `/api/v1/schedule/events/${smokeEventId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status: "confirmado" }),
      },
    );
    ok("PATCH agenda confirmar evento", confirmEvent.status, confirmEvent.body);

    const cancelSlot = new Date();
    cancelSlot.setDate(cancelSlot.getDate() + 5);
    cancelSlot.setHours(16, 0, 0, 0);
    const cancelEnd = new Date(cancelSlot.getTime() + 60 * 60 * 1000);
    const cancelTarget = await api<{ id: string }>("/api/v1/schedule/events", {
      method: "POST",
      body: JSON.stringify({
        startsAt: cancelSlot.toISOString(),
        endsAt: cancelEnd.toISOString(),
        type: "treino_livre",
        kartId,
      }),
    });
    ok("POST agenda evento (cancel prep)", cancelTarget.status, cancelTarget.body);
    const cancelEventId = cancelTarget.body.data?.id;
    if (cancelEventId) {
      const cancel = await api(
        `/api/v1/schedule/events/${cancelEventId}/cancel`,
        {
          method: "POST",
          body: JSON.stringify({ reason: "Smoke cancel" }),
        },
      );
      ok("POST agenda cancel", cancel.status, cancel.body);
    }
  }

  const todaySessions = await api<{ id: string; status: string }[]>(
    `/api/v1/lessons/sessions?date=${today}`,
  );
  ok("Aulas sessions (write prep)", todaySessions.status, todaySessions.body);
  let lessonSessionId =
    todaySessions.body.data?.find((s) => s.id === SMOKE_FIXTURES.lessonSessionId)
      ?.id ??
    todaySessions.body.data?.find((s) => LESSON_ACTIVE_STATUSES.has(s.status))
      ?.id;

  if (!lessonSessionId) {
    fail(
      "Aula smoke",
      "nenhuma sessão ativa hoje — execute npm run smoke:setup",
    );
  }

  const startLesson = await api(
    `/api/v1/lessons/sessions/${lessonSessionId}/start`,
    {
      method: "POST",
      body: JSON.stringify({ kartId: SMOKE_FIXTURES.kart12Id }),
    },
  );
  ok("POST aula start", startLesson.status, startLesson.body);
  const registerLesson = await api(
    `/api/v1/lessons/sessions/${lessonSessionId}/register`,
    {
      method: "POST",
      body: JSON.stringify({
        sessionId: lessonSessionId,
        laps: [
          {
            id: "smoke-1",
            lap: 1,
            s1: "10.000",
            s2: "10.000",
            s3: "10.000",
            total: "30.000",
          },
        ],
        notes: {
          positives: "Smoke",
          improvements: "",
          recommendations: "",
          general: "",
        },
        method: "manual",
      }),
    },
  );
  ok("POST aula register", registerLesson.status, registerLesson.body);

  const purchaseOrder = await api("/api/v1/inventory/purchase-orders", {
    method: "POST",
    body: JSON.stringify({
      supplierId: SMOKE_FIXTURES.supplierBrasilId,
      inventoryPartId: SMOKE_FIXTURES.partPneuId,
      qty: 2,
      unitCostCents: 5000,
    }),
  });
  ok("POST purchase order", purchaseOrder.status, purchaseOrder.body);

  const receivables = await api<
    { id: string; status: string; amountCents: number }[]
  >("/api/v1/finance/receivables?status=pendente");
  ok("Finance receivables (write prep)", receivables.status, receivables.body);
  const receivableId =
    receivables.body.data?.find((r) => r.id === SMOKE_FIXTURES.receivableSmokePayId)
      ?.id ??
    receivables.body.data?.find((r) => r.status === "pendente")?.id;
  if (!receivableId) {
    fail(
      "Finance payment",
      "nenhum título pendente — execute npm run smoke:setup",
    );
  }
  const payment = await api("/api/v1/finance/payments", {
    method: "POST",
    body: JSON.stringify({
      receivableId,
      amountCents: 100,
      paidAt: new Date().toISOString(),
      method: "Pix",
    }),
  });
  ok("POST finance payment", payment.status, payment.body);

  const weekGet = await api<{
    days: { key: string; enabled: boolean; slots: unknown[] }[];
    specificDates: unknown[];
    exceptions: unknown[];
  }>("/api/v1/schedule/week");
  ok("GET schedule week (write prep)", weekGet.status, weekGet.body);
  const weekConfig = weekGet.body.data;
  if (weekConfig?.days?.length) {
    const weekPut = await api("/api/v1/schedule/week", {
      method: "PUT",
      body: JSON.stringify({
        days: weekConfig.days,
        specificDates: weekConfig.specificDates,
        exceptions: weekConfig.exceptions,
      }),
    });
    ok("PUT schedule week", weekPut.status, weekPut.body);
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const createReceivable = await api("/api/v1/finance/receivables", {
    method: "POST",
    body: JSON.stringify({
      clientId: clientId ?? SMOKE_FIXTURES.clientLucasId,
      amountCents: 15000,
      dueDate: dueDate.toISOString().slice(0, 10),
      serviceLabel: "Smoke receivable",
      paymentMethod: "Pix",
    }),
  });
  ok("POST finance receivable", createReceivable.status, createReceivable.body);

  if (kartId) {
    const timeline = await api(
      `/api/v1/karts/${kartId}/technical-timeline`,
    );
    ok("GET kart technical-timeline", timeline.status, timeline.body);
  }

  const dre = await api<{ structuredRows: { id: string; kind: string }[] }>(
    "/api/v1/finance/dre?key=current-month",
  );
  ok("Finance DRE (entries prep)", dre.status, dre.body);
  const lineRow = dre.body.data?.structuredRows?.find((r) => r.kind === "line");
  if (lineRow) {
    const dreEntries = await api(
      `/api/v1/finance/dre/entries?accountId=${lineRow.id}&key=current-month`,
    );
    ok("GET finance dre entries", dreEntries.status, dreEntries.body);
  }

  type SettingsUserRow = {
    id: string;
    name: string;
    modules: {
      moduleKey: string;
      canView: boolean;
      canEdit: boolean;
      canDelete: boolean;
    }[];
  };
  const settingsUsers = await api<SettingsUserRow[]>("/api/v1/settings/users");
  ok("Settings users (write prep)", settingsUsers.status, settingsUsers.body);
  const profileRows = settingsUsers.body.data ?? [];
  if (profileRows.length > 0) {
    const usersPut = await api<SettingsUserRow[]>("/api/v1/settings/users", {
      method: "PUT",
      body: JSON.stringify({
        users: profileRows.map((u) => ({
          id: u.id,
          name: u.name,
          modules: u.modules,
        })),
      }),
    });
    ok("PUT settings users", usersPut.status, usersPut.body);
  }

  const teamList = await api<
    { id: string; roleKey: string; permissionProfileId?: string | null }[]
  >("/api/v1/team?page=1");
  ok("Equipe lista (write prep)", teamList.status, teamList.body);
  const adminMember = teamList.body.data?.find(
    (m) =>
      m.roleKey === "admin" ||
      m.permissionProfileId === "user-administrador",
  );
  if (adminMember) {
    const deleteAdmin = await api(`/api/v1/team/${adminMember.id}`, {
      method: "DELETE",
    });
    if (deleteAdmin.status !== 403 || deleteAdmin.body.success) {
      throw new Error(
        "[FAIL] DELETE equipe admin — esperado HTTP 403, recebido " +
          `${deleteAdmin.status}`,
      );
    }
    console.info("[OK] DELETE equipe admin bloqueado (403)");
  }

  const smokeSuffix = Date.now();
  const createTeam = await api<{ id: string }>("/api/v1/team", {
    method: "POST",
    body: JSON.stringify({
      firstName: "Smoke",
      lastName: "Equipe",
      email: `smoke.team.${smokeSuffix}@example.com`,
      username: `smoke.team.${smokeSuffix}`,
      permissionProfileId: "user-recepcao",
      active: true,
    }),
  });
  ok("POST equipe membro", createTeam.status, createTeam.body);
  const smokeTeamId = createTeam.body.data?.id;
  if (smokeTeamId) {
    const filtered = await api<unknown[]>(
      "/api/v1/team?permissionProfileId=user-recepcao",
    );
    ok("GET equipe filtro perfil", filtered.status, filtered.body);
    const removeSmoke = await api(`/api/v1/team/${smokeTeamId}`, {
      method: "DELETE",
    });
    ok("DELETE equipe smoke", removeSmoke.status, removeSmoke.body);
  }

  cookie = "";
  const pilotLogin = await api("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: process.env.SMOKE_PILOT_EMAIL ?? "piloto@gurgelteam.com.br",
      password: process.env.SMOKE_PASSWORD ?? "Gurgel@123",
    }),
  });
  ok("Login piloto", pilotLogin.status, pilotLogin.body);

  for (const [label, path] of [
    ["Piloto home", "/api/v1/pilot/home"],
    ["Piloto profile", "/api/v1/pilot/profile"],
    ["Piloto account", "/api/v1/pilot/account"],
    ["Piloto evolution", "/api/v1/pilot/evolution"],
    ["Piloto achievements", "/api/v1/pilot/achievements"],
    ["Piloto dashboard", "/api/v1/pilot/dashboard"],
  ] as const) {
    const res = await api<unknown>(path);
    ok(label, res.status, res.body);
  }

  const pilotAccount = await api<{ linkedPilots: unknown[] }>(
    "/api/v1/pilot/account",
  );
  ok("Piloto account (data)", pilotAccount.status, pilotAccount.body);
  if (!Array.isArray(pilotAccount.body.data?.linkedPilots)) {
    throw new Error("[FAIL] Piloto account — linkedPilots ausente");
  }
  console.info("[OK] Piloto account — linkedPilots presente");

  const pilotProfile = await api<{ name: string }>("/api/v1/pilot/profile");
  ok("Piloto profile (write prep)", pilotProfile.status, pilotProfile.body);
  const patchProfile = await api("/api/v1/pilot/profile", {
    method: "PATCH",
    body: JSON.stringify({
      name: pilotProfile.body.data?.name ?? "Piloto Smoke",
      notifyWhatsapp: true,
      notifyEmail: true,
      emergencyName: "Contato Smoke",
      emergencyPhone: "(61) 99999-0000",
      emergencyRelation: "Familiar",
    }),
  });
  ok("PATCH piloto profile", patchProfile.status, patchProfile.body);

  const avatarMissing = await api("/api/v1/pilot/profile/avatar", {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (avatarMissing.status !== 400) {
    throw new Error(
      `[FAIL] POST piloto avatar sem arquivo — esperado 400, recebido ${avatarMissing.status}`,
    );
  }
  console.info("[OK] POST piloto avatar — validação sem arquivo");

  const consentImage = await api("/api/v1/pilot/consents", {
    method: "POST",
    body: JSON.stringify({
      type: "image",
      status: "ACCEPTED",
      version: "1",
    }),
  });
  ok("POST piloto consent imagem", consentImage.status, consentImage.body);

  const pilotHome = await api<{ nextActivities: unknown[] }>("/api/v1/pilot/home");
  ok("Piloto home (data)", pilotHome.status, pilotHome.body);
  if (!Array.isArray(pilotHome.body.data?.nextActivities)) {
    throw new Error("[FAIL] Piloto home — nextActivities ausente");
  }
  console.info("[OK] Piloto home — nextActivities presente");

  function firstBookableIsoDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    while (date.getDay() === 1) {
      date.setDate(date.getDate() + 1);
    }
    return date.toISOString().slice(0, 10);
  }

  async function findAvailableBookingSlot(): Promise<{
    date: string;
    slotId: string;
    clientId: string;
  } | null> {
    for (let offset = 1; offset <= 14; offset++) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      if (date.getDay() === 1) continue;
      const isoDate = date.toISOString().slice(0, 10);
      const res = await api<{
        slots: Array<{
          slotId: string;
          status: string;
          eligiblePilots: Array<{ clientId: string }>;
        }>;
      }>(`/api/v1/pilot/booking/slots?date=${isoDate}`);
      if (res.status !== 200) continue;
      const available = res.body.data?.slots.find(
        (slot) =>
          slot.status === "available" && slot.eligiblePilots.length > 0,
      );
      if (available) {
        return {
          date: isoDate,
          slotId: available.slotId,
          clientId: available.eligiblePilots[0]!.clientId,
        };
      }
    }
    return null;
  }

  const bookingDate = firstBookableIsoDate();
  const bookingSlots = await api<{
    slots: Array<{ slotId: string; status: string }>;
  }>(`/api/v1/pilot/booking/slots?date=${bookingDate}`);
  ok("GET piloto booking slots", bookingSlots.status, bookingSlots.body);

  const bookingTarget = await findAvailableBookingSlot();
  if (!bookingTarget) {
    console.info("[SKIP] POST piloto booking — nenhum slot disponível em 14 dias");
  } else {
    const confirmBooking = await api<{ eventId: string }>("/api/v1/pilot/booking", {
      method: "POST",
      body: JSON.stringify({
        date: bookingTarget.date,
        slotId: bookingTarget.slotId,
        clientIds: [bookingTarget.clientId],
      }),
    });
    ok("POST piloto booking", confirmBooking.status, confirmBooking.body);
    if (!confirmBooking.body.data?.eventId) {
      throw new Error("[FAIL] POST piloto booking — eventId ausente");
    }
    console.info("[OK] POST piloto booking — eventId presente");
  }

  console.info("\nChecklist concluído com sucesso.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
