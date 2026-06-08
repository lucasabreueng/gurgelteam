# AUTH_SPEC — Especificação de autenticação (Fase 2)

> **Status:** `[CONFIRMADO]` — 2026-05-28  
> **Estado atual:** login/cadastro **mock** — senha não validada, sem sessão server-side  
> **Implementação alvo:** Fase 5 (backend) · Guards UI: Fase 6

---

## Objetivos

1. Autenticar staff (`/admin`) e portal piloto/responsável (`/piloto`).
2. Suportar responsável cadastrando e gerenciando menores.
3. Integrar com `PERMISSIONS_MATRIX.md` (ModuleKey + escopo).
4. Preparar rotas API `/api/v1/*` com Bearer token ou cookie httpOnly.

---

## Identificadores de login

| Campo | Regra | Fonte mock |
|-------|-------|------------|
| email | Formato válido, único | `auth.schemas.ts` |
| username | `nome.sobrenome`, 3–29 chars, `[a-z0-9.]`, único | `validate-auth-forms.ts` |
| password | Min 8, 1 maiúscula, 1 número, 1 especial, sem espaços | `auth.schemas.ts` |

**Login aceita:** email **ou** username + password.

---

## Fluxos

### 1. Login (`POST /api/v1/auth/login`) `[PLANEJADO]`

**Request:**
```json
{
  "identifier": "piloto@gurgelteam.com.br",
  "password": "********",
  "remember": true
}
```

**Response 200:**
```json
{
  "data": {
    "user": { "id", "email", "username", "roleKey", "clientId" },
    "accessToken": "...",
    "expiresIn": 3600
  }
}
```

**Cookie (alternativa):** `session` httpOnly, Secure, SameSite=Lax.

**Erros:** 401 credenciais inválidas · 403 conta inativa · 429 rate limit

**Mock atual:** `AuthServiceMock.login` → redirect `/piloto` sem validar senha.

---

### 2. Cadastro piloto/adulto (`POST /api/v1/auth/register`) `[PLANEJADO]`

| Campo | Obrigatório |
|-------|-------------|
| firstName, lastName | ✓ |
| email, cpf, birthDate | ✓ |
| password | ✓ |
| categoryIds, levelId | ✓ (piloto) |

**Regra menor:** `BR-AUTH-MINOR` — idade &lt; 14 → **403**; responsável deve cadastrar via fluxo guardian.

---

### 3. Cadastro via admin (`NewClientDrawer`) `[MOCK]`

Staff cria cliente → e-mail convite senha → `clients-runtime-store`.

**Alvo:** `POST /api/v1/clients` + job e-mail assíncrono.

---

### 4. Recuperação de senha

| Etapa | Endpoint | Mock |
|-------|----------|------|
| Solicitar | `POST /api/v1/auth/password/forgot` | Mascara e-mail |
| Verificar código | `POST /api/v1/auth/password/verify` | 6 dígitos |
| Redefinir | `POST /api/v1/auth/password/reset` | Nova senha |

---

### 5. Logout (`POST /api/v1/auth/logout`) `[PLANEJADO]`

Invalida sessão server-side + limpa cookie.

---

### 6. Sessão atual (`GET /api/v1/auth/me`) `[PLANEJADO]`

Retorna user + permissions[] + escopo (clientIds para responsável).

---

## Sessão e tokens

| Aspecto | Decisão proposta |
|---------|------------------|
| Access token | JWT curto (15–60 min) ou session id opaco |
| Refresh | httpOnly cookie, rotação a cada uso |
| Remember me | Refresh TTL 30 dias vs 24h |
| Staff vs portal | Mesmo issuer; claim `aud`: `admin` \| `portal` |
| Permissões | Embed `modules[]` no token **ou** lookup DB por request |

**Recomendação:** lookup DB para permissões (evita token stale após admin alterar módulos).

---

## Guards (Next.js)

| Rota | Guard | Redirect |
|------|-------|----------|
| `/admin/*` | `requireStaff` + `requireModule` | `/login?next=` ou `/403` |
| `/piloto/*` | `requirePortalAuth` | `/login` |
| `/api/admin/*` | middleware + role | 401/403 JSON |

**Páginas estáticas hoje:** `/401`, `/403`, `/sessao-expirada` — sem redirect automático.

---

## Contas mock (desenvolvimento)

| Identifier | Perfil |
|------------|--------|
| piloto@gurgelteam.com.br | Piloto |
| ana.silva@... | Staff `[ver auth-accounts-mocks]` |

**Produção:** remover mocks; seed apenas em `NODE_ENV=development`.

---

## Segurança

| Item | Alvo |
|------|------|
| Password hash | bcrypt ou argon2 |
| Rate limit login | 5 tentativas / 15 min / IP |
| CPF | Validar dígitos verificadores |
| CSRF | Cookie session + double-submit ou SameSite strict |
| Auditoria | `AUTH_LOGIN`, `AUTH_LOGOUT`, `AUTH_PASSWORD_RESET` → `AUDIT_LOG_SPEC.md` |

---

## Relacionados

- `PERMISSIONS_MATRIX.md`  
- `ENTITY_CATALOG.md` §1  
- `BUSINESS_RULES.md` §2  
- `lib/contracts/auth/auth.schemas.ts`
