"use client";

import { useEffect } from "react";

const ROOT_CLASS = "admin-panel-root";
const BODY_CLASS = "admin-panel-body";

function applyPanelDocumentStyles() {
  const root = document.documentElement;
  const body = document.body;

  root.style.margin = "0";
  root.style.padding = "0";
  root.style.backgroundColor = "#f3f5f9";
  root.style.minHeight = "0";
  root.style.height = "auto";
  body.style.margin = "0";
  body.style.padding = "0";
  body.style.backgroundColor = "#f3f5f9";
  body.style.minHeight = "0";
  body.style.height = "auto";

  /* Altura visível real (Safari iOS / iPad — evita vão com dvh/svh) */
  const vh = window.innerHeight * 0.01;
  root.style.setProperty("--app-vh", `${vh}px`);
}

function scrollPanelToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Alinha html/body ao painel admin (iPad 7 / Safari antigo). */
export function useAdminPanelDocument() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add(ROOT_CLASS);
    body.classList.add(BODY_CLASS);
    applyPanelDocumentStyles();
    scrollPanelToTop();

    const onViewportLayout = () => {
      applyPanelDocumentStyles();
    };

    window.addEventListener("resize", onViewportLayout);
    window.addEventListener("orientationchange", onViewportLayout);

    const vv = window.visualViewport;
    vv?.addEventListener("resize", onViewportLayout);

    const t = window.setTimeout(onViewportLayout, 120);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onViewportLayout);
      window.removeEventListener("orientationchange", onViewportLayout);
      vv?.removeEventListener("resize", onViewportLayout);

      root.classList.remove(ROOT_CLASS);
      body.classList.remove(BODY_CLASS);
      root.style.margin = "";
      root.style.padding = "";
      root.style.backgroundColor = "";
      root.style.minHeight = "";
      root.style.height = "";
      body.style.margin = "";
      body.style.padding = "";
      body.style.backgroundColor = "";
      body.style.minHeight = "";
      body.style.height = "";
      root.style.removeProperty("--app-vh");
    };
  }, []);
}
