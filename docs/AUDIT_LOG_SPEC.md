# AUDIT_LOG_SPEC — Log de auditoria (Fase 2)

> **Status:** `[CONFIRMADO]` — 2026-05-28  
> **Estado atual:** `[AUSENTE]` — nenhuma persistência de audit trail  
> **Implementação alvo:** Fase 5 (tabela `audit_logs`) + Fase 6 (UI admin opcional)

---

## Objetivo

Registrar ações sensíveis para compliance operacional, disputas financeiras e rastreio de alterações em dados críticos (agenda, financeiro, consentimentos, permissões).

---

## Entidade `audit_logs`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | ✓ | PK |
| occurred_at | timestamptz | ✓ | UTC |
| actor_user_id | UUID | ✓ | Quem executou |
| actor_role | string | — | Snapshot role |
| action | AuditAction | ✓ | Ver catálogo abaixo |
| entity_type | string | ✓ | Ex.: `schedule_event` |
| entity_id | string | ✓ | ID da entidade |
| payload_before | jsonb | — | Estado anterior (diff) |
| payload_after | jsonb | — | Estado novo |
| ip_address | inet | — | |
| user_agent | string | — | |
| request_id | string | — | Correlação API |

**Retenção proposta:** 24 meses online; archive cold storage após.

**Imutabilidade:** append-only; sem UPDATE/DELETE (exceto LGPD anonymization job).

---

## Catálogo de ações (`AuditAction`)

### Auth
| Action | Descrição |
|--------|-----------|
| `AUTH_LOGIN_SUCCESS` | Login ok |
| `AUTH_LOGIN_FAILED` | Tentativa falha |
| `AUTH_LOGOUT` | Logout |
| `AUTH_PASSWORD_RESET` | Senha redefinida |

### Clientes
| Action | Descrição |
|--------|-----------|
| `CLIENT_CREATED` | Novo piloto |
| `CLIENT_UPDATED` | Alteração perfil |
| `CLIENT_DEACTIVATED` | Status inativo |
| `GUARDIAN_LINKED` | Vínculo responsável |

### Agenda & registro
| Action | Descrição |
|--------|-----------|
| `SCHEDULE_EVENT_CREATED` | Nova aula |
| `SCHEDULE_EVENT_CONFIRMED` | Confirmação |
| `SCHEDULE_EVENT_CANCELLED` | Cancelamento |
| `SCHEDULE_EVENT_RESCHEDULED` | Remarcação |
| `LESSON_REGISTRATION_COMPLETED` | Finalizar registro |
| `KART_SWAPPED` | Troca de kart na aula |

### Frota & manutenção
| Action | Descrição |
|--------|-----------|
| `KART_STATUS_CHANGED` | Transição status |
| `MAINTENANCE_ORDER_CREATED` | Nova OS |
| `CHECKLIST_COMPLETED` | Checklist completo |
| `KART_RELEASED` | Liberado para pista |

### Financeiro
| Action | Descrição |
|--------|-----------|
| `RECEIVABLE_CREATED` | Nova receita |
| `PAYMENT_RECORDED` | Pagamento |
| `RECEIVABLE_WRITTEN_OFF` | Baixa/cancelamento |
| `EXPENSE_CREATED` | Despesa |

### Estoque
| Action | Descrição |
|--------|-----------|
| `STOCK_MOVEMENT` | Entrada/saída/ajuste |
| `PURCHASE_ORDER_STATUS` | Workflow compra |

### Config & permissões
| Action | Descrição |
|--------|-----------|
| `SETTINGS_UPDATED` | Preços, horários, etc. |
| `USER_PERMISSION_CHANGED` | Módulo atribuído/revogado |
| `ROLE_CHANGED` | RoleKey alterado |

### Consent & legal
| Action | Descrição |
|--------|-----------|
| `CONSENT_ACCEPTED` | Aceite termo |
| `CONSENT_REVOKED` | Revogação (especial imagem) |

### Telemetria
| Action | Descrição |
|--------|-----------|
| `TELEMETRY_UPLOADED` | Upload arquivo |
| `TELEMETRY_PROCESSED` | Job concluído/falhou |

---

## Eventos prioritários (MVP backend)

Implementar primeiro estes 12:

1. `AUTH_LOGIN_SUCCESS` / `AUTH_LOGIN_FAILED`
2. `CLIENT_CREATED`
3. `SCHEDULE_EVENT_CREATED` / `CONFIRMED` / `CANCELLED`
4. `LESSON_REGISTRATION_COMPLETED`
5. `KART_STATUS_CHANGED`
6. `RECEIVABLE_CREATED` / `PAYMENT_RECORDED`
7. `USER_PERMISSION_CHANGED`
8. `CONSENT_REVOKED`

---

## API (alvo Fase 5)

```
GET /api/v1/admin/audit-logs?entityType=&entityId=&actorId=&from=&to=
```

**Permissão:** admin + módulo `configuracoes` ou `relatorios`.

**Response:** paginação cursor-based; `payload_*` omitido em listagem (detalhe sob demanda).

---

## Implementação

```typescript
// Pseudocódigo service layer
await auditLog.write({
  action: "SCHEDULE_EVENT_CONFIRMED",
  entityType: "schedule_event",
  entityId: event.id,
  payloadAfter: { status: "confirmado" },
  actorUserId: ctx.user.id,
});
```

- Fire-and-forget async (fila) para não bloquear request.
- Falha no audit **não** deve falhar operação principal — alerta ops.

---

## UI (opcional Fase 6)

- Aba em `/admin/configuracoes` (futuro: ou módulo `relatorios` quando existir rota)
- Filtro por entidade, usuário, período
- Link contextual no drawer da agenda (“Ver histórico”)

---

## Relacionados

- `ENTITY_CATALOG.md` §12  
- `AUTH_SPEC.md`  
- `PERMISSIONS_MATRIX.md`
