# SESSION_HANDOFF — Retomar trabalho em outro chat

> **Leia este arquivo primeiro** ao abrir um chat novo no projeto **GURGEL API**.  
> **Atualizado:** 2026-06-05  
> **Complementa:** `docs/MIGRATION_STATUS.md` (matriz mock vs HTTP) · `docs/VALIDATION_CHECKLIST.md` (testes manuais)

---

## 1. Em uma frase

Next.js 15 + Prisma/PostgreSQL (Supabase). A migração **mock → HTTP** está **madura no admin** (agenda, clientes, karts, aulas, financeiro, estoque, manutenção, equipe, configurações). A **área do piloto** evoluiu: perfil HTTP completo, dashboard simplificado e **página de reservar horário** (`/piloto/reservar`) com calendário, consulta de slots e **confirmação de reserva** via `POST /pilot/booking`.

---

## 2. Status do projeto (avaliação 2026-06-05)

| Área | Estado | Notas |
|------|--------|-------|
| **Admin — agenda P0** | ✅ HTTP | Eventos, bloqueios, remarcação, nova aula, grade semanal |
| **Admin — clientes/karts/aulas** | ✅ HTTP | Lista, perfil, workspace aulas, detalhe kart |
| **Admin — financeiro/estoque/manutenção** | ⚠️ HTTP core | Charts, insights, OS, checklist; export PDF/Excel ainda mock |
| **Admin — equipe + permissões** | ✅ HTTP | CRUD equipe, perfis custom JSON, sync no login |
| **Admin — dashboard** | ✅ HTTP | Fix 403 (sync permissões + `repair:staff-permissions`) |
| **Piloto — dashboard** | ✅ HTTP | `GET /pilot/home`; menu lateral: Dashboard, Reservar, Telemetria |
| **Piloto — perfil** | ✅ HTTP | Account bundle, linked pilots, PATCH profile, avatar, consents |
| **Piloto — reservar** | ✅ HTTP | `GET/POST /pilot/booking*`; UI calendário + confirmação |
| **Piloto — telemetria** | ⚠️ HTTP | Sessões nuvem via API; GPS/gráficos import local |
| **CI / smoke** | ✅ | `validate.yml`, `smoke:setup`, `smoke:checklist` (~53+ checks) |
| **Modo mock** | ✅ | UI funciona sem DB (`NEXT_PUBLIC_DATA_SOURCE=mock`) |

**Fase atual:** Fase 6 (integração HTTP) — **admin essencialmente completo**; piloto em **polimento** (plano/pacotes, reserva para dependentes na UI).

---

## 3. Quick start (copiar/colar)

```bash
cp .env.example .env
# Preencher: DATABASE_URL, DIRECT_URL, SESSION_SECRET

npm install
npm run db:generate
npm run db:migrate          # ou: npx prisma db push (se migration pendente)
npm run db:seed             # ~2 min remoto

# Modo HTTP (obrigatório para validar API real)
# .env → NEXT_PUBLIC_DATA_SOURCE=http

npm run dev                 # http://localhost:3000
```

**Após alterar `prisma/schema.prisma`:** pare o `npm run dev`, rode `npx prisma db push` e `npx prisma generate`, suba o dev de novo (Windows pode dar EPERM no generate com servidor ativo).

### Login demo

| Papel | E-mail | Senha |
|-------|--------|-------|
| Admin | `ana.silva@gurgelteam.com.br` | `Gurgel@123` |
| Piloto (responsável) | `piloto@gurgelteam.com.br` | `Gurgel@123` |
| Financeiro | `financeiro@gurgelteam.com.br` | `Gurgel@123` |

**Piloto vinculados no seed:** Lucas (`piloto@…`) tem dependentes **Theo** e **Lara** (`prisma/seed-linked-pilots.ts`).

### Smokes

```bash
npm run smoke:http
npm run smoke:setup && npm run smoke:checklist
npm run validate              # tsc + lint
```

### Reparar permissões da equipe (se admin voltar 403 no dashboard)

```bash
npm run repair:staff-permissions
```

Depois: **logout + login** com `ana.silva@gurgelteam.com.br` ou recarregar `/admin`.

---

## 4. Trabalho recente (multi-sessão — o que já foi feito)

### 4.1 Admin — Equipe e permissões (2026-06-02)

| Item | Estado |
|------|--------|
| Página `/admin/equipe` + API `GET/POST/PATCH/DELETE /team` | ✅ |
| Perfis custom persistidos (`organization_settings.permission_profiles`) | ✅ |
| `PUT /api/v1/settings/users` — salvar nomes/permissões de perfis | ✅ |
| Fix dashboard 403 — `syncStaffUserPermissions` no login + script repair | ✅ |
| Migration `20260602200000_permission_profiles` | ✅ |

### 4.2 Área do piloto — perfil e conta (2026-06-04)

| Item | Estado |
|------|--------|
| `GET /pilot/account` — bundle com perfis + `linkedPilots` | ✅ |
| `GET/PATCH /pilot/profile`, `POST /pilot/profile/avatar` | ✅ |
| `POST /pilot/consents`, linked pilots CRUD parcial | ✅ |
| Preferências, emergência, `favoriteNumber` no DB | ✅ migration `20260604140000_client_preferences_emergency` |
| Campos perfil piloto (peso, altura, cidade…) | ✅ `20260604120000_client_profile_fields` |
| UI: tabela pilotos vinculados, painéis laterais, feedback erro no save | ✅ |
| Seed Theo/Lara vinculados a Lucas | ✅ `prisma/seed-linked-pilots.ts` |
| Smoke ampliado: account, consents, avatar, linkedPilots, PATCH profile | ✅ |

### 4.3 Área do piloto — shell e dashboard

| Item | Estado |
|------|--------|
| Menu lateral: **Dashboard**, **Reservar**, **Telemetria** | ✅ |
| Removida navegação por hash `#section-*` no dashboard | ✅ |
| Header: badge nível removido; “Próxima aula” linka `/piloto/reservar` | ✅ |

### 4.4 Reservar horário — `/piloto/reservar` (2026-06-05)

| Item | Estado |
|------|--------|
| Página com calendário (`KartReservaDayPicker`) + lista de horários | ✅ |
| `GET /api/v1/pilot/booking/slots?date=YYYY-MM-DD` | ✅ |
| Permissão `pilotoAgenda` (view); grade filtrada por categoria/nível do piloto | ✅ |
| Status: disponível / ocupado / bloqueado / nível incompatível | ✅ |
| **POST confirmar reserva** (criar evento na agenda) | ✅ |
| Smoke automatizado para booking slots + POST | ✅ |

### 4.5 Infra / seeds

| Item | Estado |
|------|--------|
| Fix `npm run db:seed` — upsert karts por `number` (evita P2002) | ✅ |
| `seed-schedule.ts`, `seed-karts.ts`, `smoke-setup.ts` alinhados | ✅ |

---

## 5. Schema / migrations recentes

| Migration | Conteúdo |
|-----------|----------|
| `20260602200000_permission_profiles` | JSON perfis custom + `User.permissionProfileId` |
| `20260604120000_client_profile_fields` | Campos físicos/endereço piloto |
| `20260604130000_guardian_link_relationship` | Relação responsável ↔ menor |
| `20260604140000_client_preferences_emergency` | `notifyWhatsapp/Email`, emergência, `favoriteNumber` |

Se o Prisma Client não reconhecer campos novos → `db push` + `generate` com servidor parado.

---

## 6. Arquivos-chave por domínio

### Piloto — reserva

| Arquivo | Função |
|---------|--------|
| `app/piloto/reservar/page.tsx` | Rota |
| `components/student-area/booking/pilot-booking-page.tsx` | UI calendário + slots |
| `components/student-area/booking/pilot-booking-slot-list.tsx` | Lista horários |
| `app/api/v1/pilot/booking/slots/route.ts` | GET slots do dia |
| `app/api/v1/pilot/booking/route.ts` | POST confirmar reserva |
| `lib/server/pilot/build-pilot-booking-slots.ts` | Monta timeline (grade + eventos + bloqueios) |
| `lib/server/pilot/confirm-pilot-booking.ts` | Valida slot + cria evento |
| `services/student/pilotBookingService.ts` | Service mock/HTTP |
| `lib/query/hooks/use-pilot-booking-slots.ts` | React Query (slots) |
| `lib/query/hooks/use-confirm-pilot-booking.ts` | Mutation confirmar |

### Piloto — perfil / conta

| Arquivo | Função |
|---------|--------|
| `components/student-area/profile/profile-page.tsx` | Página perfil |
| `app/api/v1/pilot/account/route.ts` | Bundle account |
| `app/api/v1/pilot/linked-pilots/**` | Menores vinculados |
| `lib/server/pilot/pilot-repository.ts` | Mapeamento Prisma → DTO |
| `prisma/seed-linked-pilots.ts` | Theo/Lara no seed |

### Admin — equipe / permissões

| Arquivo | Função |
|---------|--------|
| `components/admin/team-page.tsx` | UI equipe |
| `lib/server/settings/permission-profile-store.ts` | JSON perfis |
| `lib/server/auth/sync-staff-permissions.ts` | Sync no login |
| `scripts/repair-staff-permissions.ts` | Reparo manual |

### Navegação piloto

| Arquivo | Função |
|---------|--------|
| `lib/student-area-mocks.ts` | `STUDENT_NAV`, hrefs |
| `components/student-area/sidebar.tsx` | Menu + ícones |
| `lib/admin/pilot-nav-modules.ts` | `/piloto/reservar` → `pilotoAgenda` |

---

## 7. Problemas conhecidos / armadilhas

| Problema | O que fazer |
|----------|-------------|
| Dashboard admin 403 | `npm run repair:staff-permissions` + relogin |
| `Unknown field permissionProfiles` | `npx prisma db push` + `generate` (dev parado) |
| `prisma generate` EPERM (Windows) | Fechar `npm run dev` |
| Smoke falha “Aula smoke — nenhuma sessão ativa hoje” | `npm run smoke:setup` e reexecutar checklist |
| Smoke falha kart ocupado (409) | `smoke:setup` ou ajustar slot no script |
| Reserva piloto 403 no POST | `pilotoAgenda` precisa `editar` — `npm run db:seed` ou `npm run smoke:setup` |
| Telemetria GPS | Só import CSV local; nuvem = setores/tempos |
| Muito código local **sem commit** | `git status` antes de assumir estado remoto |

---

## 8. Validação manual pendente

Ver **`docs/VALIDATION_CHECKLIST.md`** — especialmente:

- §3.5 Equipe + Configurações perfis
- §12 Área do piloto (atualizado com `/piloto/reservar` e perfil HTTP)

Checklist rápido piloto:

1. Login `piloto@gurgelteam.com.br` → `/piloto` carrega KPIs e timeline
2. Menu **Reservar** → calendário → clicar data → horários aparecem
3. Horário verde selecionável; cinza/azul desabilitados
4. `/piloto/perfil` → editar preferências/emergência → Salvar → recarregar persiste
5. **Mudar perfil** → Theo/Lara (se seed aplicado) → painéis laterais corretos
6. `/piloto/telemetria` → sessão nuvem → setores

---

## 9. Próximos passos sugeridos (prioridade)

1. **Validação browser** — checklist §12 completo (`/piloto/reservar` com confirmar)
2. **Commit/push** — consolidar trabalho local (muitas alterações fora do git remoto)
3. Reserva para piloto vinculado na UI (campo `clientId` já na API)
4. Financeiro/export PDF, telemetria laps no Prisma (P2 — ver `ROADMAP.md`)

---

## 10. Documentos por prioridade

| Ordem | Arquivo | Conteúdo |
|-------|---------|----------|
| 1 | **`docs/SESSION_HANDOFF.md`** | Este arquivo — contexto e status |
| 2 | `docs/MIGRATION_STATUS.md` | Matriz mock vs HTTP + marcos |
| 3 | `docs/VALIDATION_CHECKLIST.md` | Testes manuais HTTP |
| 4 | `docs/AI_CONTEXT.md` | Resumo curto para agentes |
| 5 | `docs/API_SPEC.md` | Contratos rotas |
| 6 | `docs/PERMISSIONS_MATRIX.md` | ModuleKey × perfil |
| 7 | `docs/ROADMAP.md` | Concluído vs pendente |

---

## 11. Histórico de marcos (recente)

| Data | Marco |
|------|-------|
| 2026-06-02 | Equipe + perfis Configurações + fix dashboard 403 |
| 2026-06-02 | Smoke 53+ checks, CI validate, lacunas finance/manutenção |
| 2026-06-04 | Perfil piloto HTTP (account, linked, preferências, emergência) |
| 2026-06-04 | Seed pilotos vinculados; fix `db:seed` karts |
| 2026-06-05 | Página `/piloto/reservar` + API `GET/POST /pilot/booking` |

---

## 12. Histórico de chat (opcional)

Transcripts Cursor ficam em `.cursor/projects/.../agent-transcripts/` (UUID `.jsonl`). Busque por: `reservar`, `perfil piloto`, `equipe`, `permission_profiles`, `smoke-checklist`.

**Ao encerrar uma sessão longa:** atualize §2, §4, §7–§9 e a data no topo; alinhe `MIGRATION_STATUS.md` e `VALIDATION_CHECKLIST.md` se mudou matriz HTTP ou rotas piloto.

---

*Última atualização documental: 2026-06-05 — status consolidado admin + piloto (reserva consulta, perfil HTTP).*
