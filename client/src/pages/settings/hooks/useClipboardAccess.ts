import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * - granted / prompt / denied: straight from the Permissions API.
 * - unsupported: the browser has a clipboard API but won't report permission
 *   state for it (Firefox and Safari throw on `clipboard-read`).
 * - unavailable: no async clipboard API at all, usually because the page is
 *   served over plain http.
 * - checking: initial query still in flight.
 */
export type ClipboardPermission =
  | "granted"
  | "prompt"
  | "denied"
  | "unsupported"
  | "unavailable"
  | "checking";

type PermissionKind = "clipboard-read" | "clipboard-write";

export interface ClipboardProbe {
  ok: boolean;
  message: string;
  at: number;
}

export interface ClipboardAccess {
  secureContext: boolean;
  apiAvailable: boolean;
  /** Whether the browser answered a Permissions API query for clipboard names. */
  canQueryPermissions: boolean;
  read: ClipboardPermission;
  write: ClipboardPermission;
  requesting: boolean;
  lastProbe: ClipboardProbe | null;
  /** Triggers the browser's clipboard-read prompt by attempting a read. */
  requestAccess: () => Promise<void>;
  /** Re-queries permission state without prompting. */
  refresh: () => Promise<void>;
}

const isSecureContext = () =>
  typeof window !== "undefined" && window.isSecureContext;

const hasClipboardApi = () =>
  typeof navigator !== "undefined" &&
  typeof navigator.clipboard?.readText === "function";

/** Null when the browser can't answer for this permission name. */
const queryPermission = async (
  name: PermissionKind,
): Promise<PermissionStatus | null> => {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return null;
  }
  try {
    return await navigator.permissions.query({ name: name as PermissionName });
  } catch {
    return null;
  }
};

const toPermission = (status: PermissionStatus | null): ClipboardPermission =>
  status ? status.state : "unsupported";

const describeReadError = (error: unknown) => {
  const name = error instanceof Error ? error.name : "";
  if (name === "NotAllowedError") {
    return "read blocked · permission was not granted";
  }
  return name ? `read failed · ${name}` : "read failed";
};

export const useClipboardAccess = (): ClipboardAccess => {
  const secureContext = isSecureContext();
  const apiAvailable = secureContext && hasClipboardApi();

  const initial: ClipboardPermission = apiAvailable ? "checking" : "unavailable";
  const [read, setRead] = useState<ClipboardPermission>(initial);
  const [write, setWrite] = useState<ClipboardPermission>(initial);
  const [canQueryPermissions, setCanQueryPermissions] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [lastProbe, setLastProbe] = useState<ClipboardProbe | null>(null);

  const refresh = useCallback(async () => {
    if (!apiAvailable) {
      setRead("unavailable");
      setWrite("unavailable");
      return;
    }
    const [readStatus, writeStatus] = await Promise.all([
      queryPermission("clipboard-read"),
      queryPermission("clipboard-write"),
    ]);
    setCanQueryPermissions(readStatus !== null || writeStatus !== null);
    setRead(toPermission(readStatus));
    setWrite(toPermission(writeStatus));
  }, [apiAvailable]);

  // Initial query, plus live updates when the user flips the site permission
  // in the browser UI while this page is open.
  useEffect(() => {
    if (!apiAvailable) {
      setRead("unavailable");
      setWrite("unavailable");
      return;
    }

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const watch = async (
      name: PermissionKind,
      apply: (permission: ClipboardPermission) => void,
    ) => {
      const status = await queryPermission(name);
      if (cancelled) {
        return;
      }
      if (!status) {
        apply("unsupported");
        return;
      }
      setCanQueryPermissions(true);
      const sync = () => apply(status.state);
      sync();
      status.addEventListener("change", sync);
      cleanups.push(() => status.removeEventListener("change", sync));
    };

    void watch("clipboard-read", setRead);
    void watch("clipboard-write", setWrite);

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [apiAvailable]);

  const requestAccess = useCallback(async () => {
    if (!apiAvailable) {
      setLastProbe({
        ok: false,
        at: Date.now(),
        message: secureContext
          ? "this browser has no async clipboard api"
          : "clipboard api needs https or localhost",
      });
      return;
    }

    setRequesting(true);
    try {
      // Only the length is kept; the text itself is never stored or shown.
      const text = await navigator.clipboard.readText();
      setLastProbe({
        ok: true,
        at: Date.now(),
        message: text.length
          ? `read ok · ${text.length} characters on the clipboard`
          : "read ok · clipboard is empty",
      });
    } catch (error) {
      setLastProbe({
        ok: false,
        at: Date.now(),
        message: describeReadError(error),
      });
    } finally {
      setRequesting(false);
      void refresh();
    }
  }, [apiAvailable, secureContext, refresh]);

  return useMemo(
    () => ({
      secureContext,
      apiAvailable,
      canQueryPermissions,
      read,
      write,
      requesting,
      lastProbe,
      requestAccess,
      refresh,
    }),
    [
      secureContext,
      apiAvailable,
      canQueryPermissions,
      read,
      write,
      requesting,
      lastProbe,
      requestAccess,
      refresh,
    ],
  );
};
