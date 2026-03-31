import { useCallback, useEffect, useMemo, useState } from "react";

interface BrowserClipboardState {
  clipboardContent: string | null;
  hasClipboardPermission: boolean;
  getLastClipboardItem: () => Promise<string | null>;
}

/**
 * Custom hook to access the browser's clipboard content and permission status.
 * It listens for window focus events to update the clipboard content in real-time.
 * Returns the current clipboard content, permission status, and a function to manually fetch the latest clipboard item.
 * Note: Clipboard access requires user permission and may not work in all browsers or contexts.
 *
 * Usage:
 * const { clipboardContent, hasClipboardPermission, getLastClipboardItem } = useBrowserClipboard();
 *
 * clipboardContent: The current text content of the clipboard, or null if not accessible.
 * hasClipboardPermission: Boolean indicating if the app has permission to read the clipboard.
 * getLastClipboardItem: Function to manually fetch the latest clipboard content (useful for on-demand updates).
 */
export const useBrowserClipboard = (): BrowserClipboardState => {
  const [clipboardContent, setClipboardContent] = useState<string | null>(null);
  const [hasClipboardPermission, setHasClipboardPermission] = useState(false);

  const getLastClipboardItem = useCallback(async () => {
    if (!("clipboard" in navigator) || !window.isSecureContext) {
      setHasClipboardPermission(false);
      return null;
    }

    try {
      const value = await navigator.clipboard.readText();
      setClipboardContent(value);
      setHasClipboardPermission(true);
      return value;
    } catch {
      setHasClipboardPermission(false);
      return null;
    }
  }, []);

  useEffect(() => {
    const updatePermission = async () => {
      if (!("permissions" in navigator)) {
        return;
      }

      try {
        const status = await navigator.permissions.query({
          name: "clipboard-read" as PermissionName,
        });

        setHasClipboardPermission(status.state === "granted");
      } catch {
        setHasClipboardPermission(false);
      }
    };

    void updatePermission();
    void getLastClipboardItem();

    const onFocus = () => {
      void getLastClipboardItem();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [getLastClipboardItem]);

  return useMemo(
    () => ({
      clipboardContent,
      hasClipboardPermission,
      getLastClipboardItem,
    }),
    [clipboardContent, hasClipboardPermission, getLastClipboardItem],
  );
};
