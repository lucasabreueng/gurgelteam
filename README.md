# Gurgel Team — Site & Admin

Frontend Next.js 15 para o kartódromo **Gurgel Team**, com painel admin operacional, área do piloto e telemetria. Backend integrado via Route Handlers + Prisma + PostgreSQL (Supabase).

## Documentação

| Documento | Descrição |
|-----------|-----------|
| **[docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md)** | **Retomar em chat novo** — última sessão, bugs conhecidos, quick start |
| **[docs/MIGRATION_STATUS.md](docs/MIGRATION_STATUS.md)** | Matriz completa mock → HTTP |
| [docs/VALIDATION_CHECKLIST.md](docs/VALIDATION_CHECKLIST.md) | Checklist de validação manual no browser |
| [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md) | Resumo para agentes IA |
| [docs/PRE_BACKEND_FLOW.md](docs/PRE_BACKEND_FLOW.md) | Fases 1–6 do projeto |
| [CHECKPOINT.md](CHECKPOINT.md) | Marco arquitetural atual |

## Setup rápido

```bash
git clone <repo>
cd "GURGEL API"
cp .env.example .env
# Preencher DATABASE_URL, DIRECT_URL, SESSION_SECRET

npm install
npm run db:generate
npm run db:migrate    # requer Supabase/PostgreSQL
npm run db:seed       # usuários demo + dados iniciais (~2 min remoto)

npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### Modo HTTP (API + banco)

No `.env`:

```env
NEXT_PUBLIC_DATA_SOURCE=http
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
SESSION_SECRET=uma-string-longa-aleatoria
ENABLE_ROUTE_GUARD=true   # opcional em dev
```

Login admin: `ana.silva@gurgelteam.com.br` / `Gurgel@123`

### Modo mock (sem banco)

```env
NEXT_PUBLIC_DATA_SOURCE=mock
```

Ou omitir a variável (padrão).

## Scripts

| Comando | Função |
|---------|--------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build produção |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Aplica migrations |
| `npm run db:seed` | Popula banco demo |
| `npm run db:studio` | Prisma Studio |

## Stack

Next.js 15 · React 19 · Tailwind CSS · TypeScript · TanStack Query · Prisma · Supabase · Zod · ECharts

## Estrutura

```
app/           # Rotas App Router + API (/api/v1/*)
components/    # UI admin, piloto, landing
lib/           # Contratos, server, query, schedule
services/      # Camada de serviço (mock | HTTP)
repositories/  # Acesso a dados
prisma/        # Schema + migrations + seed
docs/          # Documentação permanente
```

## Status (2026-06-01)

- **Agenda P0:** integrada em HTTP (eventos, bloqueios, remarcação, nova aula, grade semanal)
- **Auth:** login real com sessão + cookie
- **Pendente:** financeiro, estoque, manutenção, registro de aulas (UI), demais configurações

Ver [docs/MIGRATION_STATUS.md](docs/MIGRATION_STATUS.md) para detalhes.
