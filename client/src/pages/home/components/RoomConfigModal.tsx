import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface RoomConfigModalProps {
  open: boolean;
  roomCode: string;
  onClose: () => void;
  onJoinRoom: (roomCode: string) => Promise<void>;
  onCreateRoom: () => Promise<void>;
}

export const RoomConfigModal = ({
  open,
  roomCode,
  onClose,
  onJoinRoom,
  onCreateRoom,
}: RoomConfigModalProps) => {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setJoinCode("");
      setError("");
      setIsBusy(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleJoin = async () => {
    if (joinCode.length !== 6) {
      setError("Room code must be 6 characters.");
      return;
    }

    setError("");
    setIsBusy(true);
    try {
      await onJoinRoom(joinCode.toUpperCase());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to join room.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleCreate = async () => {
    setError("");
    setIsBusy(true);
    try {
      await onCreateRoom();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create room.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded border border-[var(--border)] bg-[var(--background)] p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-light lowercase">room config</h2>
            <p className="font-mono-ui mt-2 text-xs tracking-[0.08em] text-[var(--muted-foreground)]">
              current: {roomCode}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
            aria-label="Close room config"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              join existing room
            </p>
            <input
              type="text"
              value={joinCode}
              onChange={(event) => {
                const value = event.target.value
                  .toUpperCase()
                  .replace(/[^A-Z]/g, "")
                  .slice(0, 6);
                setJoinCode(value);
              }}
              placeholder="room code"
              className="font-mono-ui w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-center text-lg tracking-[0.18em] focus:border-[var(--foreground)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleJoin}
              disabled={isBusy}
              className="w-full rounded border border-[var(--border)] px-3 py-2.5 font-mono-ui text-xs tracking-[0.08em] transition-colors hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Join room
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              or
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={isBusy}
            className="w-full rounded border border-[var(--foreground)] bg-[var(--foreground)] px-3 py-2.5 font-mono-ui text-xs tracking-[0.08em] text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create new room
          </button>

          {error && (
            <div className="rounded border border-[#e8cece] bg-[#f8ecec] px-3 py-2 font-mono-ui text-xs text-[var(--destructive)]">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
