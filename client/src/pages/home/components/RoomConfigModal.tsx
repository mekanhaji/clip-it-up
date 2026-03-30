import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useRoomStore, useSocketStore } from "@/store/room";
import { X } from "lucide-react";
import { useState } from "react";
import { createRoom } from "../api/rooms";
import { createRoomSocket } from "../api/ws";

interface RoomConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export const RoomConfigModal = ({ open, onClose }: RoomConfigModalProps) => {
  const { code, status, updateRoomCode, updateStatus } = useRoomStore();
  const { setSocket } = useSocketStore();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const _preCall = () => {
    setIsPending(true);
    updateStatus("connecting");
    setError(null);
    toast({
      title: "Joining room...",
      variant: "default",
      description: `Attempting to join room ${code}...`,
    });
  };

  const _postCall = (roomCode: string) => {
    toast({
      title: "Joined room",
      variant: "default",
      description: `Successfully joined room ${roomCode}!`,
    });
    updateRoomCode(roomCode);
    setIsPending(false);
    onClose();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    _preCall();

    const formData = new FormData(e.currentTarget);
    const newCode = formData.get("code") as string;

    const socket = createRoomSocket(newCode);
    setSocket(socket);

    _postCall(newCode);
  };

  const handleCreateRoom = async () => {
    _preCall();

    const roomCode = await createRoom();
    const socket = createRoomSocket(roomCode);
    setSocket(socket);

    _postCall(roomCode);
  };

  if (!open) return null;
  // TODO: use shadcn dialog
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded border border-[var(--border)] bg-[var(--background)] p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-light lowercase">room config</h2>
            <p className="font-mono-ui mt-2 text-xs tracking-[0.08em] text-[var(--muted-foreground)]">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  status === "connected"
                    ? "bg-emerald-500"
                    : status === "connecting"
                      ? "bg-amber-500"
                      : "bg-[var(--muted-foreground)]",
                )}
              />
              {status}
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
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="code"
                placeholder="room code"
                className="font-mono-ui w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-center text-lg tracking-[0.18em] focus:border-[var(--foreground)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded border border-[var(--border)] px-3 py-2.5 font-mono-ui text-xs tracking-[0.08em] transition-colors hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Join room
              </button>
            </form>
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
            onClick={handleCreateRoom}
            disabled={isPending}
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
