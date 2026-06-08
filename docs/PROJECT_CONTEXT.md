# PROJECT_CONTEXT — Gurgel Team

> **Última atualização:** 2026-06-01  
> **Handoff:** [`MIGRATION_STATUS.md`](MIGRATION_STATUS.md)  
> **Fonte:** código existente em `gurgel-team-site` (pasta `GURGEL API`)  
> **Legenda:** `[CONFIRMADO]` = evidência direta no código · `[INFERIDO]` = dedução/planejado

---

## 1. Visão geral

| Campo | Valor |
|-------|-------|
| Nome npm | `gurgel-team-site` v1.0.0 |
| Tipo | Frontend Next.js 15 (App Router) — site institucional + painéis operacionais |
| Domínio de negócio | Kartódromo / escola de pilotagem **Gurgel Team** `[CONFIRMADO]` — referências em `lib/admin-settings-mocks.ts`, landing em `sections/` |
| Backend | **Implementado (P0)** `[CONFIRMADO]` — Route Handlers `/api/v1/*` + Prisma + PostgreSQL (Supabase). Modo `mock` ainda disponível. |
| README raiz | Setup + links docs `[CONFIRMADO]` |

Apesar do nome da pasta do repositório (`GURGEL API`), o projeto é um **frontend completo** preparado para integração futura com API/backend via camadas `contracts → repositories → services`.

---

## 2. Objetivos do sistema

`[INFERIDO]` a partir dos módulos implementados e copy institucional:

1. **Presença digital** — landing comercial, reserva pública, FAQ, parceiros (`sections/`, `/reserva`)
2. **Gestão operacional** — agenda, clientes, frota, manutenção, estoque, financeiro (`/admin/*`)
3. **Formação de pilotos** — registro de aulas, feedback, evolução por nível/categoria
4. **Telemetria** — importação e análise de voltas (MyChron, Alfano, GPS, GoPro) no client (`lib/telemetry-engine/`)
5. **Área do piloto** — dashboard, perfil, telemetria, ranking, conquistas (`/piloto/*`)
6. **Configuração centralizada** — horários, preços, categorias, permissões, documentos legais (`/admin/configuracoes`)

---

## 3. Público-alvo

| Persona | Área | Evidência |
|---------|------|-----------|
| Visitante / prospect | Landing, reserva pública | `/`, `/reserva` |
| Piloto / aluno | Área do piloto | `/piloto/*`, `lib/student-area-mocks.ts` |
| Responsável legal | Cadastro vinculado, perfil menor | `lib/cadastro-mocks.ts`, `ClientGuardian` |
| Staff operacional | Admin (agenda, registro) | `RoleKey` operacional em settings |
| Recepção | Admin (agenda, clientes) | `RoleKey: recepcao` |
| Financeiro | Admin financeiro | `RoleKey: financeiro` |
| Mecânico | Manutenção, estoque, karts | mock de papel "Mecânico" em settings |
| Administrador | Acesso total | `RoleKey: admin` |

---

## 4. Fluxos principais

### 4.1 Público e autenticação

| Fluxo | Rota(s) | Status |
|-------|---------|--------|
| Landing institucional | `/` | UI completa `[CONFIRMADO]` |
| Reserva pública (data → slot → login → confirmação) | `/reserva` | Mockada `[CONFIRMADO]` — `FRONTEND_AUDIT.md` |
| Login | `/login` | Mock — sem sessão real |
| Cadastro | `/cadastro` | Validação Zod; persistência mock |
| Recuperação de senha | `/recuperar-senha`, `/recuperar-senha/redefinir` | Mock |

### 4.2 Área do piloto

| Fluxo | Rota(s) | Status |
|-------|---------|--------|
| Dashboard | `/piloto` | Mock |
| Perfil (dados, segurança, consentimentos) | `/piloto/perfil` | Parcial |
| Cadastro de piloto vinculado | `/piloto/perfil/cadastrar-piloto` | Redirecionamento legado |
| Telemetria (importação, análise) | `/piloto/telemetria` | Pipeline client-side maduro |
| Setores detalhados | `/piloto/telemetria/setores` | Parcial |

### 4.3 Admin operacional

| Fluxo | Rota | Status |
|-------|------|--------|
| Dashboard executivo | `/admin` | Mock |
| Agenda operacional | `/admin/agenda` | **HTTP P0 completo** — eventos, bloqueios, remarcação, nova aula, grade |
| Registro de aulas (manual/OCR/telemetria) | `/admin/registro-aulas` | Parcial — API v1; UI parcialmente mock |
| CRM clientes/alunos | `/admin/clientes` | Mock |
| Frota de karts | `/admin/karts` | Mock |
| Manutenção (OS, checklist, inspeção) | `/admin/manutencao` | Mock |
| Estoque (peças, fornecedores, compras) | `/admin/estoque` | Mock + stores locais |
| Financeiro (overview, receber, pagar, fluxo, DRE) | `/admin/financeiro` | Mock |
| Configurações | `/admin/configuracoes` | Grade semanal HTTP; demais abas mock |
| Telemetria admin | `/admin/telemetria/*` | Parcial |

### 4.4 Fluxos transversais

- **Menor de 14 anos** → responsável ≥18 deve cadastrar `[CONFIRMADO]` — `lib/cadastro-mocks.ts`
- **Agenda → Registro de aulas** — eventos finalizados alimentam sessões registráveis `[CONFIRMADO]`
- **Checklist/Inspeção → Manutenção** — falhas críticas bloqueiam kart `[CONFIRMADO]`
- **Estoque → OS** — saída de peças valida estoque `[CONFIRMADO]`

---

## 5. Módulos existentes

| Módulo | Nav key | Rota | Componentes | Service |
|--------|---------|------|-------------|---------|
| Dashboard | `dashboard` | `/admin` | `admin-dashboard-page.tsx` | `DashboardServiceMock` |
| Agenda | `agenda` | `/admin/agenda` | `schedule/*` | `schedule`, `scheduleBlocks`, `scheduleReschedule`, `newClass`, `weekSchedule` (mock/HTTP) |
| Registro de aulas | `registroAulas` | `/admin/registro-aulas` | `lesson-registration/*` | `LessonServiceMock` |
| Clientes | `alunos` | `/admin/clientes` | `clients/*` (27 arquivos) | `ClientsServiceMock` |
| Karts | `karts` | `/admin/karts` | `karts/*` (11 arquivos) | `KartsServiceMock` |
| Manutenção | `manutencao` | `/admin/manutencao` | `maintenance/*` (87 arquivos) | `MaintenanceServiceMock` + checklist/inspection/parts |
| Estoque | `estoque` | `/admin/estoque` | `inventory/*` (33 arquivos) | `InventoryServiceMock` |
| Financeiro | `financeiro` | `/admin/financeiro` | `financial/*` (54 arquivos) | `FinancialServiceMock`, `CashFlowServiceMock` |
| Telemetria | `telemetria` | `/admin/telemetria` | `telemetry/*` | `TelemetryServiceMock` |
| Configurações | `configuracoes` | `/admin/configuracoes` | `settings/*` | `SettingsServiceMock` + `weekSchedule` (HTTP) |
| Área piloto | — | `/piloto/*` | `student-area/*` | `StudentAreaServiceMock`, etc. |
| Auth | — | `/login`, `/cadastro`, etc. | `login/*`, `cadastro/*` | `AuthServiceMock` |
| Landing | — | `/` | `sections/*` (11 seções) | — |
| Reserva pública | — | `/reserva` | `kart-reserva-*`, `sections/KartReserva.tsx` | mocks locais |

**Total de componentes `.tsx`:** ~412 `[CONFIRMADO]`

---

## 6. Módulos planejados

`[INFERIDO]` — presentes na navegação/modelo de permissões, **sem rota dedicada**:

| Módulo | Nav key | Evidência |
|--------|---------|-----------|
| Relatórios operacionais | `relatorios` | `ModuleKey`; relatórios financeiros existem, módulo dedicado não |

`[INFERIDO]` — próximos passos documentados em `MIGRATION_STATUS.md`:

- Wire UI registro de aulas → HTTP
- Config — datas específicas / exceções de grade
- HTTP financeiro, estoque, manutenção, dashboard, piloto
- Proxy rotas legadas `/api/admin/*` → v1

---

## 7. Estrutura de rotas

### 7.1 Páginas (`app/**/page.tsx`) — 28 rotas

```
/                           Landing
/login                      Login
/cadastro                   Cadastro
/recuperar-senha            Recuperação
/recuperar-senha/redefinir  Redefinição
/reserva                    Reserva pública

/piloto                     Dashboard piloto
/piloto/perfil              Perfil
/piloto/perfil/cadastrar-piloto
/piloto/telemetria          Telemetria
/piloto/telemetria/setores  Setores

/admin                      Dashboard admin
/admin/agenda               Agenda
/admin/clientes             Clientes
/admin/karts                Karts
/admin/manutencao           Manutenção
/admin/estoque              Estoque
/admin/financeiro           Financeiro
/admin/registro-aulas       Registro de aulas
/admin/configuracoes        Configurações
/admin/telemetria           Telemetria admin
/admin/telemetria/setores   Setores admin

/401, /403, /500            Erros
/sessao-expirada            Sessão expirada
/manutencao                 Manutenção do sistema
```

### 7.2 API Routes

**v1 (produção):** ~35 rotas em `app/api/v1/**/route.ts`

| Grupo | Exemplos |
|-------|----------|
| Auth | `POST /api/v1/auth/login`, `GET /api/v1/auth/session`, password-recovery |
| Agenda | `GET/POST /api/v1/schedule/events`, `blocks`, `slots`, `week`, `meta`, `upcoming-days` |
| Agenda mutações | `POST .../cancel`, `.../reschedule`, `.../swap-kart` |
| Clientes | `GET/POST /api/v1/clients`, `/:id`, guardians, stats, timeline |
| Karts | `GET /api/v1/karts`, `/:id/status`, assign-client |
| Aulas | `GET/POST /api/v1/lessons/sessions`, start, register, ocr |
| Referência | `GET /api/v1/reference/catalog` |
| Infra | `GET /api/v1/supabase/health` |

**Legado (migrar):**

| Método | Rota |
|--------|------|
| GET | `/api/admin/schedule/events`, `events/[id]`, `upcoming-days`, `meta` |
| POST | `/api/admin/lesson-registration/ocr` |

Ver inventário completo: `MIGRATION_STATUS.md` §5.

### 7.3 Observações de roteamento

- **`middleware.ts`** `[CONFIRMADO]` — guard `/admin/*` e `/piloto/*` quando `ENABLE_ROUTE_GUARD=true`
- Páginas 401/403/500/sessão-expirada são estáticas, preparadas para guards futuros
- Layouts especiais: `app/piloto/telemetria/layout.tsx`, `app/admin/telemetria/layout.tsx`

---

## 8. Tecnologias utilizadas

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | Next.js (App Router) | 15.1.6 |
| UI | React | 19.0.0 |
| Estilo | Tailwind CSS | 3.4.17 |
| Fonte | Sora (Google Fonts) | pesos 100–800 |
| Estado servidor | TanStack React Query | 5.100.14 |
| Validação | Zod | 4.4.3 |
| Gráficos | ECharts + echarts-for-react | 6.0 / 3.0 |
| Datas | date-fns, react-day-picker | 4.1 / 10.0 |
| Ícones | react-icons (hi2) | 5.4.0 |
| Carousel | Swiper | 11.2.1 |
| Export | exceljs | — |
| Telemetria GoPro | gopro-telemetry, gpmf-extract | vendor esbuild |
| Linguagem | TypeScript (strict) | 5.7.2 |
| ORM | Prisma | 6.x |
| DB | PostgreSQL (Supabase) | — |
| Auth client | @supabase/supabase-js, @supabase/ssr | — |

| Lint | ESLint + eslint-config-next | 8.57 / 15.1 |

### Variáveis de ambiente (`.env.example`)

| Variável | Valores | Uso |
|----------|---------|-----|
| `DATABASE_URL` | PostgreSQL pooler | Prisma runtime |
| `DIRECT_URL` | PostgreSQL direct | Migrations/seed |
| `SESSION_SECRET` | string longa | Cookie sessão |
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` (padrão) \| `http` | Modo de dados |
| `NEXT_PUBLIC_API_URL` | URL ou vazio | Base API externa |
| `ENABLE_ROUTE_GUARD` | `true` \| `false` | Proteção rotas |
| `NEXT_PUBLIC_SUPABASE_URL` | — | Supabase client |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | — | Supabase anon key |
| `SEED_DEFAULT_PASSWORD` | default `Gurgel@123` | Seed usuários |
| `OPENAI_API_KEY` | — | OCR cronometragem |

---

## 9. Arquitetura de software

```
UI (components/, app/)
    ↓ hooks React Query (lib/query/hooks/) ou getAppServices()
Services (services/*)
    ↓
Repositories (repositories/*)
    ↓
Mocks (lib/*-mocks.ts) | HTTP (lib/api/http-client.ts + app/api/*)
```

**Registry central:** `lib/data-source/app-services.ts` — 22 domínios via `getAppServices()`.

**Contratos:** `lib/contracts/` — DTOs, enums, schemas Zod, `ApiResponse<T>`.

Documentação detalhada: `docs/frontend-architecture.md`.

---

## 10. Convenções gerais

### 10.1 Código

| Convenção | Detalhe |
|-----------|---------|
| Alias de import | `@/*` → raiz do projeto (`tsconfig.json`) |
| Componentes | PascalCase; pastas por domínio em `components/admin/`, `components/student-area/` |
| Mocks | `lib/admin-{domínio}-mocks.ts`, `lib/{domínio}-mocks.ts` |
| Services | `services/{domínio}/{domínio}ServiceMock.ts` |
| Repositories | `repositories/{domínio}/{Domínio}RepositoryMock.ts` |
| Contratos | `lib/contracts/{domínio}/index.ts` |
| Hooks React Query | `lib/query/hooks/use-{domínio}.ts` |
| UI não importa mocks diretamente | Consome `getAppServices()` ou hooks `[CONFIRMADO]` — `CHECKPOINT.md` |

### 10.2 Nomenclatura de domínio

- **Cliente/Aluno** — termos intercambiáveis na UI admin (`alunos` na nav, pasta `clients/`)
- **Piloto** — persona na área do aluno (`/piloto`)
- **Kart** — unidade de frota; ownership `rental` (próprio) ou `client` (do cliente)
- **Evento** — unidade da agenda; **Sessão** — unidade do registro de aulas

### 10.3 Idioma

- UI em **português brasileiro** `[CONFIRMADO]`
- Código (nomes de variáveis, tipos) mistura PT e EN — seguir padrão do arquivo existente

### 10.4 Commits e documentação legada

Documentos na raiz (referência histórica, preferir `/docs`):

- `FRONTEND_ARCHITECTURE_REPORT.md`
- `FRONTEND_AUDIT.md`
- `CHECKPOINT.md`

---

## 11. Estado de prontidão

**Fase 6 em andamento** `[CONFIRMADO]` — ver `MIGRATION_STATUS.md`

| Área | Status |
|------|--------|
| Auth + sessão | ✅ Implementado |
| Schema + migrations | ✅ Aplicável |
| Agenda P0 HTTP | ✅ Concluído |
| Grade semanal | ✅ Persistida |
| Demais domínios | ❌ Mock |
| Design system | ⚠️ Fragmentado |
