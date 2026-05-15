# Design system — Gurgel Team (template HTML)

Este documento descreve os **padrões visuais globais** extraídos de `css/custom.css` e dos componentes HTML existentes. Novas páginas (ex.: Área do Piloto) devem **reutilizar variáveis, classes e ritmo** abaixo — sem introduzir paleta, tipografia ou raios fora deste sistema.

## Stack

- HTML5, **Bootstrap 5**, **jQuery**
- Fonte: **Sora** (Google Fonts)
- Estilos principais: `css/custom.css` (variáveis `:root` + tema `html[data-color-mode="dark"]`)

> **Nota:** O repositório é template **HTML estático** (não Next.js/Tailwind). Novas telas seguem esta stack; referências a React/Tailwind no briefing devem ser adaptadas para componentes HTML + classes globais acima.

## Cores (`:root`)

| Token | Uso |
|--------|-----|
| `--primary-color` | Texto forte / fundos em blocos escuros |
| `--secondary-color` | Fundos de seção (`bg-section`), cards |
| `--bg-color` | Fundo da página |
| `--text-color` | Corpo de texto |
| `--accent-color` / `--accent-secondary-color` | Destaque (azul-marinho `#0d1f3c`) |
| `--white-color` | Branco |
| `--divider-color` | Bordas / divisores |

Tema escuro: mesmos tokens redefinidos em `html[data-color-mode="dark"]` (fundos neutros escuros).

## Tipografia

- Família: `var(--default-font)` → Sora
- Títulos de seção: blocos `.section-title` com `h3` (rótulo) + `h2` / `h1`
- Destaque em título escuro: `<span>` dentro de `h1`/`h2` com gradiente (clip de texto) já definido em `.section-title h1 span`, `.section-title h2 span`

## Componentes reutilizáveis

- **Botões:** `.btn-default`, `.btn-default.btn-highlighted`
- **Cards com canto decorativo:** `.box-bg-shape` (pseudo-elemento do tema)
- **Cards de serviço / blocos:** `.service-item`, `.service-item.box-bg-shape`
- **Seções com fundo cinza container:** `.bg-section` (max-width, border-radius 20px)
- **Seções escuras:** `.dark-section` (hero / CTAs)
- **Header global:** `.main-header`, `.header-sticky`, `.navbar`, `.header-btn`, `.theme-toggle-btn`, `.area-aluno-btn`
- **Grid:** `.container` / `.container-fluid`, `.row`, `.col-*` (Bootstrap)
- **Animações leves:** `wow fadeInUp` + `js/wow.min.js`

## Espaçamento e forma

- Padding vertical típico de seção: **160px** desktop / **80px** mobile (padrões já usados em `.about-us`, `.our-services`, etc.)
- **Border-radius** de cards grandes: **20px**
- **Espaçamento entre blocos:** `.section-row` (margin-bottom 80px onde aplicável)

## Identidade Gurgel / motorsport

- Linguagem visual: **precisão, contraste contido**, azul-marinho como cor de performance — **sem neon**, **sem excesso de gamificação**
- Linhas diagonais / “circuito”: usar **gradientes lineares sutis** ou SVG discreto, sempre com opacidade baixa e cores do token

## Não fazer

- Novas cores fora dos tokens (ex.: roxo neon, verde arcade)
- Tipografia fora de Sora
- Raios ou sombras muito diferentes do restante do site
- “Dashboard admin” genérico: manter **ritmo editorial** do template (títulos, respiro, hierarquia)

## Implementação de referência

- **Área do Piloto:** `area-do-piloto.html` + classes prefixadas `.pilot-*` em `custom.css` (apenas extensões; base sempre tokens e Bootstrap acima).
