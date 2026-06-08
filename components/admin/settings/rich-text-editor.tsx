"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { HiListBullet } from "react-icons/hi2";

import { AppDropdown } from "@/components/ui/app-dropdown";
import {
  applyFontSizeStyle,
  DEFAULT_FONT_SIZE_PX,
  detectFontSizePxAtNode,
  documentRichTextEditorClassName,
  normalizeRichTextHtml,
} from "@/lib/legal/document-content";
import { settingsInputClass } from "@/lib/design/classes";

const FONT_SIZES = [
  { label: "Pequeno (14px)", value: "14px" },
  { label: "Normal (16px)", value: "16px" },
  { label: "Médio (18px)", value: "18px" },
  { label: "Grande (20px)", value: "20px" },
  { label: "Muito grande (24px)", value: "24px" },
] as const;

const FONT_DROPDOWN_OPTIONS = FONT_SIZES.map((size) => ({
  value: size.value,
  label: size.label,
}));

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  /** Toolbar fixa; preenche a altura disponível do pai e rola só o conteúdo. */
  fillHeight?: boolean;
  className?: string;
};

function toolbarButtonClass(active = false) {
  return `flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition ${
    active
      ? "border-accent bg-accent/10 text-accent"
      : "border-[rgba(17,17,17,0.12)] bg-white text-[#0d1f3c] hover:border-accent/30 hover:bg-[#fafbfc]"
  }`;
}

function wrapRangeWithFontSize(
  range: Range,
  fontSize: string,
  selection: Selection,
): void {
  const span = document.createElement("span");
  applyFontSizeStyle(span, fontSize);

  try {
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
  } catch {
    document.execCommand(
      "insertHTML",
      false,
      `<span style="font-size:${fontSize};line-height:1.625">${range.toString()}</span>`,
    );
    return;
  }

  selection.removeAllRanges();
  const next = document.createRange();
  next.selectNodeContents(span);
  selection.addRange(next);
}

function insertTypingFontSpan(
  range: Range,
  fontSize: string,
  selection: Selection,
): void {
  const span = document.createElement("span");
  applyFontSizeStyle(span, fontSize);
  span.setAttribute("data-caret-font", "true");
  span.appendChild(document.createTextNode("\uFEFF"));
  range.insertNode(span);

  const cursor = document.createRange();
  cursor.setStart(span.firstChild!, 1);
  cursor.collapse(true);
  selection.removeAllRanges();
  selection.addRange(cursor);
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo do documento…",
  minHeight = 280,
  fillHeight = false,
  className = "",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorSelectionRef = useRef<Range | null>(null);
  const isInternalUpdateRef = useRef(false);
  const typingFontSizeRef = useRef<string | null>(null);
  const [fontSize, setFontSize] = useState<string>(DEFAULT_FONT_SIZE_PX);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    bulletList: false,
  });

  const persistEditorSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      editorSelectionRef.current = range.cloneRange();
    }
  }, []);

  const restoreEditorSelection = useCallback(() => {
    const saved = editorSelectionRef.current;
    if (!saved) return false;
    const sel = window.getSelection();
    if (!sel) return false;
    sel.removeAllRanges();
    sel.addRange(saved);
    return true;
  }, []);

  const syncToolbarState = useCallback(() => {
    const sel = window.getSelection();
    const anchor = sel?.anchorNode ?? null;
    setFontSize(detectFontSizePxAtNode(anchor, editorRef.current));
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      bulletList: document.queryCommandState("insertUnorderedList"),
    });
  }, []);

  const emitChange = useCallback(
    (normalize = true) => {
      const el = editorRef.current;
      if (!el) return;
      isInternalUpdateRef.current = true;
      const html = normalize ? normalizeRichTextHtml(el.innerHTML) : el.innerHTML;
      onChange(html);
      syncToolbarState();
    },
    [onChange, syncToolbarState],
  );

  useEffect(() => {
    const el = editorRef.current;
    if (!el || isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }
    if (document.activeElement === el) return;

    const normalized = normalizeRichTextHtml(value);
    if (el.innerHTML !== normalized) {
      el.innerHTML = normalized;
    }
  }, [value]);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const runCommand = (command: string) => {
    focusEditor();
    document.execCommand(command, false);
    emitChange();
  };

  const applyFontSize = useCallback(
    (size: string) => {
      focusEditor();
      restoreEditorSelection();

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

      typingFontSizeRef.current = size;

      if (!range.collapsed) {
        wrapRangeWithFontSize(range, size, selection);
      } else {
        insertTypingFontSpan(range, size, selection);
      }

      persistEditorSelection();
      setFontSize(size);
      emitChange(false);
    },
    [emitChange, persistEditorSelection, restoreEditorSelection],
  );

  const handleFontSizeChange = (size: string) => {
    applyFontSize(size);
  };

  const handleBeforeInput = (event: FormEvent<HTMLDivElement>) => {
    const inputEvent = event.nativeEvent as InputEvent;
    if (inputEvent.inputType !== "insertText" || !inputEvent.data) return;

    const size = typingFontSizeRef.current;
    if (!size) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const root = editorRef.current;
    if (!root?.contains(range.commonAncestorContainer)) return;

    const currentSize = detectFontSizePxAtNode(sel.anchorNode, root);
    if (currentSize === size) return;

    event.preventDefault();

    const span = document.createElement("span");
    applyFontSizeStyle(span, size);
    span.textContent = inputEvent.data;
    range.deleteContents();
    range.insertNode(span);

    const cursor = document.createRange();
    const textNode = span.firstChild;
    if (textNode) {
      cursor.setStart(textNode, textNode.textContent?.length ?? 0);
    } else {
      cursor.selectNodeContents(span);
      cursor.collapse(false);
    }
    cursor.collapse(true);
    sel.removeAllRanges();
    sel.addRange(cursor);

    persistEditorSelection();
    emitChange(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;

    const key = event.key.toLowerCase();
    if (key === "b") {
      event.preventDefault();
      runCommand("bold");
    } else if (key === "i") {
      event.preventDefault();
      runCommand("italic");
    } else if (key === "u") {
      event.preventDefault();
      runCommand("underline");
    }
  };

  const fontDropdownTriggerClass = `${settingsInputClass} min-h-[36px] !w-auto min-w-[10.5rem] !py-1.5 !pr-2 text-[13px]`;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-[rgba(17,17,17,0.12)] bg-white ${
        fillHeight ? "min-h-0 flex-1" : ""
      } ${className}`.trim()}
    >
      <div
        className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-3 py-2"
        onMouseDownCapture={persistEditorSelection}
        onMouseDown={(event) => event.preventDefault()}
      >
        <button
          type="button"
          aria-label="Negrito"
          title="Negrito (Ctrl+B)"
          className={toolbarButtonClass(activeFormats.bold)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand("bold")}
        >
          B
        </button>
        <button
          type="button"
          aria-label="Itálico"
          title="Itálico (Ctrl+I)"
          className={`${toolbarButtonClass(activeFormats.italic)} italic`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand("italic")}
        >
          I
        </button>
        <button
          type="button"
          aria-label="Sublinhado"
          title="Sublinhado (Ctrl+U)"
          className={`${toolbarButtonClass(activeFormats.underline)} underline`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand("underline")}
        >
          U
        </button>

        <div className="mx-1 h-6 w-px bg-[rgba(17,17,17,0.12)]" aria-hidden />

        <button
          type="button"
          aria-label="Lista com marcadores"
          title="Lista com marcadores"
          className={toolbarButtonClass(activeFormats.bulletList)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runCommand("insertUnorderedList")}
        >
          <HiListBullet className="h-5 w-5" />
        </button>

        <div className="mx-1 h-6 w-px bg-[rgba(17,17,17,0.12)]" aria-hidden />

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Tamanho
          </span>
          <AppDropdown
            options={FONT_DROPDOWN_OPTIONS}
            value={fontSize}
            onSelect={(next) => handleFontSizeChange(String(next))}
            aria-label="Tamanho da fonte"
            rootClassName="relative"
            triggerClassName={fontDropdownTriggerClass}
            labelClassName="flex w-full min-w-0 items-center justify-between gap-2"
          />
        </div>
      </div>

      <div
        className={`app-scrollbar min-h-0 overflow-y-auto ${
          fillHeight ? "flex-1" : ""
        }`}
        style={
          fillHeight
            ? { minHeight }
            : { height: minHeight, maxHeight: minHeight }
        }
      >
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline
          aria-label="Conteúdo do documento"
          data-placeholder={placeholder}
          suppressContentEditableWarning
          onBeforeInput={handleBeforeInput}
          onInput={() => emitChange(false)}
          onBlur={() => {
            persistEditorSelection();
            typingFontSizeRef.current = null;
            emitChange(true);
          }}
          onKeyUp={() => {
            persistEditorSelection();
            syncToolbarState();
          }}
          onMouseUp={() => {
            persistEditorSelection();
            syncToolbarState();
          }}
          onKeyDown={handleKeyDown}
          className={`${documentRichTextEditorClassName} min-h-full px-4 py-3 outline-none [&:empty::before]:text-neutral-400 [&:empty::before]:content-[attr(data-placeholder)]`}
        />
      </div>
    </div>
  );
}
