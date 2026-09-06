import { useSyncExternalStore } from "react";

/**
 * Minimal history-based router. The app has two screens, so this stays a
 * few lines instead of pulling in a routing library. Query string and hash
 * are preserved across navigations so `?room=CODE` survives page switches.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const ROUTES = {
  home: "/",
  settings: "/settings",
} as const;

export type RouteName = keyof typeof ROUTES;

/** Prefixes a route with Vite's base path. */
export const withBase = (path: string) => `${BASE}${path}` || "/";

const stripBase = (pathname: string) => {
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || "/";
  }
  return pathname;
};

const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
};

const getPathname = () => window.location.pathname;

export const usePathname = () =>
  useSyncExternalStore(subscribe, getPathname, getPathname);

/** Resolves a pathname to a known route; unknown paths fall back to home. */
export const matchRoute = (pathname: string): RouteName => {
  const path = stripBase(pathname).replace(/\/+$/, "") || "/";
  return path === ROUTES.settings ? "settings" : "home";
};

export const useRoute = () => matchRoute(usePathname());

export const navigate = (
  route: RouteName,
  options: { replace?: boolean } = {},
) => {
  const target = withBase(ROUTES[route]);
  const { search, hash } = window.location;
  const next = `${target}${search}${hash}`;

  if (`${window.location.pathname}${search}${hash}` === next) {
    return;
  }

  if (options.replace) {
    window.history.replaceState(null, "", next);
  } else {
    window.history.pushState(null, "", next);
  }
  notify();
};
