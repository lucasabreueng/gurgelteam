# NOMENCLATURE — Padrão de nomes Gurgel Team

> **Status:** `[CONFIRMADO]` — 2026-05-28  
> **Fase:** 1 (fechamento) · Referência para Fase 5–6

---

## Regra geral

| Camada | Termo preferido | Exemplo |
|--------|-----------------|---------|
| **Banco / Prisma / API** | `client` / `clients` | `clients`, `clientId` |
| **Admin UI (português)** | **Cliente** | Nav “Clientes”, títulos mobile |
| **Portal piloto UI** | **Piloto** | “Seu perfil de piloto”, dashboard |
| **Responsável legal** | **Responsável** | Cadastro de menor, guardian |
| **ModuleKey (código)** | `alunos` | Chave histórica — **não renomear** na Fase 5 (breaking) |
| **Pasta de rotas admin** | `clientes` | `/admin/clientes` |

**Não usar “Aluno” em labels novos** — substituir por **Cliente** (admin) ou **Piloto** (portal).

---

## Mapeamento ModuleKey → UI

| ModuleKey | Label UI (`MODULE_LABELS`) | Rota |
|-----------|---------------------------|------|
| `alunos` | Clientes | `/admin/clientes` |
| `registroAulas` | Registro de aulas | `/admin/registro-aulas` |
| `pilotoDashboard` | Dashboard | `/piloto` |
| `pilotoAgenda` | Reservar | `/piloto/reservar` |

**Campo operacional:** `registradoPor` (FK → users) no evento e sessão — quem registrou/avaliou a aula.

ModuleKeys `piloto*` permanecem em permissões mesmo quando a nav piloto está reduzida (dashboard + telemetria).

---

## Entidades vs personas

```
users ──optional──► clients (piloto cadastrado)
guardians ──guardian_links──► clients (menores)
staff (users com RoleKey operacional) ──registradoPor──► schedule_events / lesson_sessions
```

---

## Histórico

| Data | Alteração |
|------|-----------|
| 2026-05-28 | Removido conceito de instrutor — usar `registradoPor` / staff operacional |
