import { useToast } from "@/components/ui/use-toast";
import { ActionRow } from "@/pages/home/components/ActionRow";
import { ClipboardCanvas } from "@/pages/home/components/ClipboardCanvas";
import { Composer } from "@/pages/home/components/Composer";
import { TopBar } from "@/pages/home/components/TopBar";
import type { ActionDefinition } from "@/pages/home/types";
import { createId } from "@/utils/clipboard";
import { useClipboardStore } from "@/store/clipboard";
import { useRoomStore, useSocketStore } from "@/store/room";
import { useSettingsStore } from "@/store/settings";
import { useCallback, useMemo, useState } from "react";
import { emitClipboardMessage } from "./api/ws";

// Incoming clips and URL <-> room syncing live in App so they keep working
// while the settings page is open.
const HomePage = () => {
  const { toast } = useToast();
  const [composerValue, setComposerValue] = useState("");
  const { entries, addEntry, clearEntries } = useClipboardStore();
  const { socket } = useSocketStore();
  const { code, leaveRoom } = useRoomStore();
  const deviceName = useSettingsStore((state) => state.deviceName);
  const clearOnLeave = useSettingsStore((state) => state.clearOnLeave);

  const hasClipboardContent = entries.length > 0;
  const hasComposerText = composerValue.trim().length > 0;

  const sendClip = useCallback(() => {
    const content = composerValue.trim();

    if (!content) {
      return;
    }

    addEntry({
      id: createId(),
      content,
      source: "local",
      createdAt: Date.now(),
    });
    if (socket && code) {
      emitClipboardMessage(socket, code, content, deviceName);
    }
    setComposerValue("");
  }, [composerValue, addEntry, socket, code, deviceName]);

  const syncClipboard = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      if (text.trim().length === 0) {
        toast({
          title: "Clipboard is empty",
          description: "Please copy something to your clipboard first.",
        });
        return;
      }

      addEntry({
        id: createId(),
        content: text.trim(),
        source: "local",
        createdAt: Date.now(),
      });
    });
  }, [addEntry, toast]);

  const actions: ActionDefinition[] = useMemo(
    () => [
      {
        key: "sync",
        label: hasComposerText ? "send" : "sync",
        variant: "primary",
        onClick: () => {
          if (hasComposerText) {
            sendClip();
            return;
          }
          syncClipboard();
        },
      },
      {
        key: "leave",
        label: "leave",
        variant: "secondary",
        onClick: () => {
          socket?.close();
          leaveRoom();
          if (clearOnLeave) {
            clearEntries();
          }
          toast({
            title: "Left room",
            description: clearOnLeave
              ? `You have left room ${code} and the board was cleared.`
              : `You have left room ${code}.`,
          });
        },
      },
      {
        key: "clear",
        label: "clear",
        variant: "ghost",
        onClick: () => {
          clearEntries();
          toast({
            title: "Clipboard cleared",
            description: "All items have been removed.",
          });
        },
      },
    ],
    [
      hasComposerText,
      sendClip,
      syncClipboard,
      clearEntries,
      clearOnLeave,
      leaveRoom,
      code,
      socket,
      toast,
    ],
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <TopBar />

      <main className="relative flex min-h-screen flex-col overflow-hidden pt-20 sm:pt-24">
        <ClipboardCanvas entries={entries} />

        <section className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-6 pb-16 sm:px-8 sm:pb-20">
          <div className="w-full max-w-2xl text-center">
            {!hasClipboardContent && (
              <>
                <h2 className="text-6xl font-light lowercase leading-[0.95] text-[var(--foreground)] sm:text-7xl">
                  the desk is clear
                </h2>
                <p className="font-mono-ui mt-6 text-[11px] tracking-[0.08em] text-[var(--muted-foreground)] sm:text-xs">
                  paste your first clip to synchronize this room.
                </p>
              </>
            )}

            <Composer
              value={composerValue}
              onChange={setComposerValue}
              onSubmit={sendClip}
              className="mx-auto mt-10 max-w-xl sm:mt-14"
            />

            <ActionRow actions={actions} className="mt-6 sm:mt-8" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
