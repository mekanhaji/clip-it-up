import { useCallback, useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClipboardItem, fallbackCopy } from "@/utils/clipboard";
import { createRoom } from "@/pages/home/api/rooms";
import { ActionRow } from "@/pages/home/components/ActionRow";
import { ClipboardCanvas } from "@/pages/home/components/ClipboardCanvas";
import { Composer } from "@/pages/home/components/Composer";
import { RoomConfigModal } from "@/pages/home/components/RoomConfigModal";
import { TopBar } from "@/pages/home/components/TopBar";
import { useRoomRealtime } from "@/pages/home/hooks/useRoomRealtime";
import { useRoomSession } from "@/pages/home/hooks/useRoomSession";
import { cn } from "@/lib/utils";
import type { ActionDefinition, ClipboardEntry } from "@/pages/home/types";

const HomePage = () => {
  const { toast } = useToast();
  const [composerValue, setComposerValue] = useState("");
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [isRoomConfigOpen, setIsRoomConfigOpen] = useState(false);

  const {
    roomCode,
    roomMode,
    ensureServerRoom,
    resetToTempRoom,
    setServerRoom,
  } = useRoomSession();

  const addEntry = useCallback(
    async (content: string, source: "local" | "remote") => {
      const value = content.trim();
      if (!value) {
        return;
      }

      const item = await createClipboardItem(value);
      setEntries((prev) => {
        if (prev.some((entry) => entry.id === item.hash)) {
          return prev;
        }

        return [
          {
            id: item.hash,
            content: value,
            source,
            createdAt: Date.now(),
          },
          ...prev,
        ];
      });
    },
    [],
  );

  const { connectionState, sendClipboardMessage } = useRoomRealtime({
    roomCode,
    enabled: roomMode === "server",
    onClipboardMessage: (content) => {
      void addEntry(content, "remote");
    },
  });

  const hasClipboardContent = entries.length > 0;

  const ensureRoomAndSend = useCallback(
    async (text: string) => {
      const value = text.trim();
      if (!value) {
        return;
      }

      try {
        const resolvedRoomCode = await ensureServerRoom();
        await addEntry(value, "local");
        sendClipboardMessage(value);

        toast({
          title: "Synced",
          description: `Clip shared to room ${resolvedRoomCode}.`,
        });
      } catch (err) {
        toast({
          title: "Sync failed",
          description: err instanceof Error ? err.message : "Unable to sync.",
          variant: "destructive",
        });
      }
    },
    [addEntry, ensureServerRoom, sendClipboardMessage, toast],
  );

  const handleSync = useCallback(async () => {
    const draft = composerValue.trim();
    if (draft) {
      await ensureRoomAndSend(draft);
      setComposerValue("");
      return;
    }

    try {
      const clipboardText = await navigator.clipboard?.readText();
      if (clipboardText?.trim()) {
        await ensureRoomAndSend(clipboardText);
        return;
      }
    } catch {
      // Fallback behavior below handles environments without clipboard access.
    }

    if (entries.length) {
      const latest = entries[0];
      const copied = await fallbackCopy(latest.content);
      toast({
        title: copied ? "Copied latest clip" : "Copy failed",
        description: copied
          ? "Latest room content copied to clipboard."
          : "Could not copy to clipboard.",
        variant: copied ? "default" : "destructive",
      });
      return;
    }

    toast({
      title: "Nothing to sync",
      description: "Paste or type content first.",
    });
  }, [composerValue, ensureRoomAndSend, entries, toast]);

  const handleLeave = useCallback(() => {
    setEntries([]);
    setComposerValue("");
    resetToTempRoom();
    toast({
      title: "Temporary room ready",
      description: "A fresh local room is active.",
    });
  }, [resetToTempRoom, toast]);

  const handleJoinRoom = async (code: string) => {
    setServerRoom(code);
    toast({
      title: "Joined room",
      description: `Connected to room ${code}.`,
    });
  };

  const handleCreateRoom = async () => {
    const nextCode = await createRoom();
    setServerRoom(nextCode);
    toast({
      title: "Room created",
      description: `Switched to room ${nextCode}.`,
    });
  };

  const actions: ActionDefinition[] = useMemo(
    () => [
      {
        key: "sync",
        label: "sync",
        variant: "primary",
        onClick: () => {
          void handleSync();
        },
      },
      {
        key: "leave",
        label: "leave",
        variant: "secondary",
        onClick: handleLeave,
      },
      {
        key: "more",
        label: "more",
        variant: "ghost",
        onClick: () => {
          toast({
            title: "Placeholder",
            description: "Future action slot is ready.",
          });
        },
      },
    ],
    [handleLeave, handleSync, toast],
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <TopBar
        roomCode={roomCode}
        roomMode={roomMode}
        connectionState={connectionState}
        onOpenRoomConfig={() => setIsRoomConfigOpen(true)}
      />

      <main className="relative flex min-h-screen flex-col overflow-hidden">
        <ClipboardCanvas entries={entries} />

        <section
          className={cn(
            "w-full px-6 pb-10 pt-4 transition-all duration-500 sm:px-8",
            hasClipboardContent
              ? "fixed bottom-0 left-0 z-20 translate-y-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/95 to-transparent"
              : "pointer-events-auto absolute left-1/2 top-1/2 z-20 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2",
          )}
        >
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <Composer
              value={composerValue}
              onChange={setComposerValue}
              compact={hasClipboardContent}
            />
            <ActionRow actions={actions} />
          </div>
        </section>
      </main>

      <RoomConfigModal
        open={isRoomConfigOpen}
        roomCode={roomCode}
        onClose={() => setIsRoomConfigOpen(false)}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default HomePage;
