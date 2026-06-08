"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  /** Preferência salva (light, dark ou system). */
  preference: ThemePreference;
  /** Tema efetivo aplicado no DOM. */
  resolvedTheme: ResolvedTheme;
  /** @deprecated Use `resolvedTheme`. */
  theme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  /** Atalho: alterna apenas entre light e dark. */
  setTheme: (theme: ResolvedTheme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "theme-preference";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? getSystemTheme() : preference;
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "dark" || value === "light" || value === "system") {
      return value;
    }
  } catch {
    /* ignore */
  }
  return "system";
}

function applyResolvedTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute("data-color-mode", resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  const applyPreference = useCallback((next: ThemePreference) => {
    const resolved = resolveTheme(next);
    setPreferenceState(next);
    setResolvedTheme(resolved);
    applyResolvedTheme(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stored = readStoredPreference();
    applyPreference(stored);
  }, [applyPreference]);

  useEffect(() => {
    if (preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyResolvedTheme(resolved);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback(
    (next: ThemePreference) => applyPreference(next),
    [applyPreference],
  );

  const setTheme = useCallback(
    (theme: ResolvedTheme) => applyPreference(theme),
    [applyPreference],
  );

  const toggleTheme = useCallback(() => {
    applyPreference(resolvedTheme === "dark" ? "light" : "dark");
  }, [applyPreference, resolvedTheme]);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      theme: resolvedTheme,
      setPreference,
      setTheme,
      toggleTheme,
    }),
    [preference, resolvedTheme, setPreference, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
