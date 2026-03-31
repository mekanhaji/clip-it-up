import { useToast } from "@/components/ui/use-toast";
import { ActionRow } from "@/pages/home/components/ActionRow";
import { ClipboardCanvas } from "@/pages/home/components/ClipboardCanvas";
import { Composer } from "@/pages/home/components/Composer";
import { TopBar } from "@/pages/home/components/TopBar";
import type { ActionDefinition } from "@/pages/home/types";
import { useClipboardStore } from "@/store/clipboard";
import { useRoomStore, useSocketStore } from "@/store/room";
import { useEffect, useMemo, useState } from "react";
import { subscribeClipboardEvents } from "./api/ws";

const HomePage = () => {
  const { toast } = useToast();
  const [composerValue, setComposerValue] = useState("");
  const { entries, addEntry, clearEntries } = useClipboardStore();
  const { socket } = useSocketStore();
  const { code, leaveRoom } = useRoomStore();

  const hasClipboardContent = entries.length > 0;
  useEffect(() => {
    if (!socket) {
      return;
    }

    const unsubscribe = subscribeClipboardEvents(socket, (content) => {
      addEntry({
        id: crypto.randomUUID(),
        content,
        source: "remote",
        createdAt: Date.now(),
      });
    });

    return unsubscribe;
  }, [socket, addEntry]);

  const actions: ActionDefinition[] = useMemo(
    () => [
      {
        key: "sync",
        label: "sync",
        variant: "primary",
        onClick: () => {
          if (!composerValue.trim()) {
            addEntry({
              id: crypto.randomUUID(),
              content: composerValue.trim(),
              source: "local",
              createdAt: Date.now(),
            });
          }
        },
      },
      {
        key: "leave",
        label: "leave",
        variant: "secondary",
        onClick: () => {
          socket?.close();
          leaveRoom();
          toast({
            title: "Left room",
            description: `You have left room ${code}.`,
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
    [toast],
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
              className="mx-auto mt-14 max-w-xl"
            />

            <ActionRow actions={actions} className="mt-8" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
