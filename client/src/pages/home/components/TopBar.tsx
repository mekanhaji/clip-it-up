import { Settings2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectionState, RoomMode } from "@/pages/home/types";

interface TopBarProps {
  roomCode: string;
  roomMode: RoomMode;
  connectionState: ConnectionState;
  onOpenRoomConfig: () => void;
}

export const TopBar = ({
  roomCode,
  roomMode,
  connectionState,
  onOpenRoomConfig,
}: TopBarProps) => {
  const statusLabel =
    roomMode === "temp"
      ? "local"
      : connectionState === "connected"
        ? "live"
        : connectionState === "connecting"
          ? "connecting"
          : "offline";

  return (
    <header className="fixed left-0 top-0 z-30 flex w-full items-center justify-between px-5 py-4 sm:px-8">
      <div className="flex items-center gap-4">
        <h1 className="font-headline text-lg font-semibold lowercase text-[var(--foreground)]">
          clipitup
        </h1>
        <button
          type="button"
          onClick={onOpenRoomConfig}
          className="group flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 transition-colors hover:bg-[var(--secondary)]"
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              statusLabel === "live"
                ? "bg-emerald-500"
                : statusLabel === "connecting"
                  ? "bg-amber-500"
                  : "bg-[var(--muted-foreground)]",
            )}
          />
          <span className="font-mono-ui text-xs tracking-[0.08em] text-[var(--muted-foreground)]">
            {roomCode}
          </span>
          <span className="font-mono-ui text-[10px] uppercase tracking-[0.08em] text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100">
            {statusLabel}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
          aria-label="Share room"
        >
          <Share2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
          aria-label="Room settings"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
