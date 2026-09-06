import { toast } from "@/components/ui/use-toast";
import { subscribeClipboardEvents } from "@/pages/home/api/ws";
import { useClipboardStore } from "@/store/clipboard";
import { useSocketStore } from "@/store/room";
import { useSettingsStore } from "@/store/settings";
import { createId } from "@/utils/clipboard";
import { useEffect } from "react";

const PREVIEW_LENGTH = 72;

const preview = (content: string) => {
  const singleLine = content.replace(/\s+/g, " ").trim();
  return singleLine.length > PREVIEW_LENGTH
    ? `${singleLine.slice(0, PREVIEW_LENGTH - 1)}…`
    : singleLine;
};

/**
 * Keeps the room socket subscription alive for the whole app rather than
 * just the home page, so clips that arrive while settings is open aren't
 * lost. Applies the "auto-copy" and "notify" preferences to each clip.
 */
export const useIncomingClips = () => {
  const socket = useSocketStore((state) => state.socket);
  const addEntry = useClipboardStore((state) => state.addEntry);

  useEffect(() => {
    if (!socket) {
      return;
    }

    return subscribeClipboardEvents(socket, (content, sender) => {
      addEntry({
        id: createId(),
        content,
        sender,
        source: "remote",
        createdAt: Date.now(),
      });

      // Read at event time so toggling a setting doesn't resubscribe.
      const { autoCopyIncoming, notifyOnIncoming } =
        useSettingsStore.getState();

      if (autoCopyIncoming && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(content).catch(() => {
          // Tab not focused or permission missing; the clip is still on the board.
        });
      }

      if (notifyOnIncoming) {
        toast({
          title: sender ? `clip from ${sender}` : "new clip",
          description: preview(content),
        });
      }
    });
  }, [socket, addEntry]);
};
