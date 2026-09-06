import { cn } from "@/lib/utils";
import { ClipboardCheck, RefreshCw } from "lucide-react";
import {
  useClipboardAccess,
  type ClipboardAccess,
  type ClipboardPermission,
} from "../hooks/useClipboardAccess";
import { SettingRow, SettingsSection } from "./SettingsSection";
import { StatusBadge, type StatusTone } from "./StatusBadge";

const PERMISSION_DISPLAY: Record<
  ClipboardPermission,
  { tone: StatusTone; label: string }
> = {
  granted: { tone: "ok", label: "granted" },
  prompt: { tone: "warn", label: "will ask" },
  denied: { tone: "bad", label: "blocked" },
  unsupported: { tone: "muted", label: "not reported" },
  unavailable: { tone: "bad", label: "unavailable" },
  checking: { tone: "muted", label: "checking" },
};

/** Only speaks up when something actually needs the user's attention. */
const nudge = (access: ClipboardAccess) => {
  if (!access.secureContext) {
    return "needs https (or localhost) to work at all.";
  }
  if (!access.apiAvailable) {
    return "this browser doesn't support it.";
  }
  if (access.read === "denied") {
    return "blocked — allow clipboard in the address bar's lock icon.";
  }
  if (access.read !== "granted") {
    return "hit request to skip the first-time prompt.";
  }
  return null;
};

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

export const ClipboardAccessSetting = () => {
  const access = useClipboardAccess();
  const readDisplay = PERMISSION_DISPLAY[access.read];
  const writeDisplay = PERMISSION_DISPLAY[access.write];
  const hint = nudge(access);

  return (
    <SettingsSection title="clipboard access">
      <SettingRow label="secure context">
        <StatusBadge tone={access.secureContext ? "ok" : "bad"}>
          {access.secureContext ? "secure" : "insecure"}
        </StatusBadge>
      </SettingRow>

      <SettingRow label="read">
        <StatusBadge tone={readDisplay.tone}>{readDisplay.label}</StatusBadge>
      </SettingRow>

      <SettingRow label="write">
        <StatusBadge tone={writeDisplay.tone}>{writeDisplay.label}</StatusBadge>
      </SettingRow>

      <div className="space-y-3 px-4 py-4 sm:px-5">
        {hint && (
          <p className="font-mono-ui text-[10px] leading-relaxed tracking-[0.06em] text-[var(--muted-foreground)]">
            {hint}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void access.requestAccess()}
            disabled={!access.apiAvailable || access.requesting}
            className="font-mono-ui inline-flex h-9 items-center gap-2 rounded border border-[var(--foreground)] bg-[var(--foreground)] px-4 text-[11px] lowercase tracking-[0.08em] text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            {access.requesting ? "asking…" : "request"}
          </button>
          <button
            type="button"
            onClick={() => void access.refresh()}
            disabled={!access.apiAvailable}
            className="font-mono-ui inline-flex h-9 items-center gap-2 rounded border border-[var(--border)] px-4 text-[11px] lowercase tracking-[0.08em] text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            recheck
          </button>
        </div>

        {access.lastProbe && (
          <p
            role="status"
            className={cn(
              "font-mono-ui text-[10px] tracking-[0.06em]",
              access.lastProbe.ok
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-[var(--destructive)]",
            )}
          >
            {access.lastProbe.message} · {formatTime(access.lastProbe.at)}
          </p>
        )}
      </div>
    </SettingsSection>
  );
};
