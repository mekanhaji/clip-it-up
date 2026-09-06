import { useSettingsStore, type ThemePreference } from "@/store/settings";
import { useEffect, useSyncExternalStore } from "react";

export type ResolvedTheme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const subscribeToSystemTheme = (listener: () => void) => {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};

const getSystemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;

export const useSystemPrefersDark = () =>
  useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemPrefersDark,
    () => false,
  );

export const resolveTheme = (
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme => {
  if (preference === "system") {
    return systemPrefersDark ? "dark" : "light";
  }
  return preference;
};

/** The theme actually on screen once the "system" preference is resolved. */
export const useResolvedTheme = (): ResolvedTheme => {
  const preference = useSettingsStore((state) => state.theme);
  const systemPrefersDark = useSystemPrefersDark();
  return resolveTheme(preference, systemPrefersDark);
};

/**
 * Mirrors the resolved theme onto <html>: the `.dark` class drives the
 * Tailwind variant, `data-theme` is informational, and `color-scheme` makes
 * native form controls and scrollbars follow along.
 * The inline script in index.html does the same before first paint.
 */
export const useApplyTheme = () => {
  const resolved = useResolvedTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  }, [resolved]);

  return resolved;
};
