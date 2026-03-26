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
    <header className="fixed left-0 top-0 z-30 flex w-full items-center justify-between px-6 py-4 sm:px-7">
      <div className="flex items-center gap-3 sm:gap-4">
        <h1 className="font-headline text-[31px] font-semibold lowercase leading-none text-[var(--foreground)] sm:text-[33px]">
          clipitup
        </h1>
        <button
          type="button"
          onClick={onOpenRoomConfig}
          className="group flex h-8 items-center gap-2 rounded border border-[var(--border)] bg-[var(--card)] px-3 transition-colors hover:bg-[var(--secondary)]"
          title={`Room ${roomCode} (${statusLabel})`}
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
          <span className="font-mono-ui text-[11px] tracking-[0.08em] text-[var(--muted-foreground)]">
            {roomCode}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          className="rounded p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
          aria-label="Share room"
        >
          <Share2 className="h-[15px] w-[15px]" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
          aria-label="Room settings"
        >
          <Settings2 className="h-[15px] w-[15px]" />
        </button>
      </div>
    </header>
  );
};
