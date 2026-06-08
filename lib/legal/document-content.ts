const HTML_CONTENT_PATTERN =
  /<(?:p|br|span|strong|b|em|i|u|div|font|h[1-6]|ul|ol|li)\b/i;

/** Line-height fixo compartilhado entre editor e visualização. */
export const DOCUMENT_RICH_LINE_HEIGHT = 1.625;

export const FONT_SIZE_CLASS_BY_PX: Record<string, string> = {
  "14px": "doc-fs-14",
  "16px": "doc-fs-16",
  "18px": "doc-fs-18",
  "20px": "doc-fs-20",
  "24px": "doc-fs-24",
};

const FONT_SIZE_CLASS_PATTERN = /\bdoc-fs-(14|16|18|20|24)\b/;

const RICH_TEXT_BASE =
  "[&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline " +
  "[&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:leading-[1.625] " +
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 " +
  "[&_li]:leading-[1.625] [&_li+li]:mt-1";

/** Classes para visualização de documentos (modal, cadastro). */
export const documentRichTextClassName =
  `document-rich-content text-sm leading-[1.625] text-neutral-700 ${RICH_TEXT_BASE}`;

/** Classes para a área editável do editor. */
export const documentRichTextEditorClassName =
  `rich-text-editor text-[15px] leading-[1.625] text-[#111] ${RICH_TEXT_BASE}`;

export const DEFAULT_FONT_SIZE_PX = "16px";

export function fontSizeToClass(fontSize: string): string {
  return FONT_SIZE_CLASS_BY_PX[fontSize] ?? FONT_SIZE_CLASS_BY_PX[DEFAULT_FONT_SIZE_PX];
}

export function applyFontSizeStyle(el: HTMLElement, fontSize: string): void {
  el.style.fontSize = fontSize;
  el.style.lineHeight = String(DOCUMENT_RICH_LINE_HEIGHT);
  el.classList.add(fontSizeToClass(fontSize));
}

export function readFontSizePx(el: HTMLElement): string | null {
  const inline = el.style.fontSize?.trim();
  if (inline && FONT_SIZE_CLASS_BY_PX[inline]) return inline;

  const fromClass = classToFontSize(el.className);
  if (fromClass) return fromClass;

  return null;
}

export function classToFontSize(className: string): string | null {
  for (const [px, cls] of Object.entries(FONT_SIZE_CLASS_BY_PX)) {
    if (className.split(/\s+/).includes(cls)) return px;
  }
  return null;
}

export function detectFontSizePxAtNode(
  node: Node | null,
  root: HTMLElement | null,
): string {
  let current: Node | null = node;
  if (current?.nodeType === Node.TEXT_NODE) {
    current = current.parentElement;
  }
  while (current && current !== root) {
    if (current instanceof HTMLElement) {
      const px = readFontSizePx(current);
      if (px) return px;
    }
    current = current.parentElement;
  }
  return DEFAULT_FONT_SIZE_PX;
}

export function isHtmlDocumentContent(content: string): boolean {
  return HTML_CONTENT_PATTERN.test(content);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Converte texto plano legado em HTML para o editor. */
export function plainContentToEditorHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "";
  if (isHtmlDocumentContent(trimmed)) return normalizeRichTextHtml(trimmed);

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => {
      const lines = escapeHtml(paragraph).replace(/\n/g, "<br>");
      return `<p>${lines}</p>`;
    })
    .join("");
}

function legacyFontSizeToPx(sizeAttr: string | null): string | null {
  if (!sizeAttr) return null;
  const map: Record<string, string> = {
    "1": "14px",
    "2": "14px",
    "3": "16px",
    "4": "18px",
    "5": "20px",
    "6": "24px",
    "7": "24px",
  };
  return map[sizeAttr] ?? null;
}

function pxFromFontSizeStyle(style: string): string | null {
  const match = style.match(/font-size:\s*([^;]+)/i);
  if (!match) return null;
  const value = match[1].trim().toLowerCase();
  if (FONT_SIZE_CLASS_BY_PX[value]) return value;
  return null;
}

function ensureFontSizeOnElement(el: HTMLElement): void {
  const px =
    pxFromFontSizeStyle(el.getAttribute("style") ?? "") ??
    classToFontSize(el.className);
  if (!px) return;
  applyFontSizeStyle(el, px);
}

/** Normaliza HTML do editor: tamanhos inline, line-height fixo, remove tags legadas. */
export function normalizeRichTextHtml(html: string): string {
  if (typeof document === "undefined") return html;

  const root = document.createElement("div");
  root.innerHTML = html;

  root.querySelectorAll("font").forEach((fontEl) => {
    const span = document.createElement("span");
    const px = legacyFontSizeToPx(fontEl.getAttribute("size"));
    if (px) applyFontSizeStyle(span, px);
    span.innerHTML = fontEl.innerHTML;
    fontEl.replaceWith(span);
  });

  root.querySelectorAll("span[style], span[class*='doc-fs-']").forEach((node) => {
    ensureFontSizeOnElement(node as HTMLElement);
  });

  root.querySelectorAll("span").forEach((node) => {
    const el = node as HTMLSpanElement;
    const text = el.textContent?.replace(/[\u200b\ufeff]/gi, "").trim() ?? "";
    if (!text && el.children.length === 0) {
      if (el.hasAttribute("data-caret-font")) return;
      el.remove();
    }
  });

  root.querySelectorAll("span").forEach((node) => {
    const el = node as HTMLSpanElement;
    const parent = el.parentElement;
    if (
      parent?.tagName === "SPAN" &&
      readFontSizePx(parent) &&
      readFontSizePx(el) &&
      parent !== el
    ) {
      parent.innerHTML = el.innerHTML;
      if (readFontSizePx(el)) {
        applyFontSizeStyle(parent, readFontSizePx(el)!);
      }
      el.remove();
    }
  });

  root.querySelectorAll("span[data-caret-font]").forEach((node) => {
    const el = node as HTMLSpanElement;
    const text = el.textContent?.replace(/[\u200b\ufeff]/gi, "").trim() ?? "";
    if (text || el.children.length > 0) {
      el.removeAttribute("data-caret-font");
    }
  });

  return root.innerHTML;
}

export function sanitizeDocumentHtml(html: string): string {
  const normalized = normalizeRichTextHtml(html);
  return normalized
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function documentContentIsEmpty(content: string): boolean {
  const plain = content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return plain.length === 0;
}

export { FONT_SIZE_CLASS_BY_PX as FONT_SIZE_CLASSES };
