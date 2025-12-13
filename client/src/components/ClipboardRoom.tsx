import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, WifiOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { ManualTextShare } from ".";
import { useClipboard } from "../hooks/useClipboard";
import type { ClipboardRoomProps } from "../types";
import ClipboardHistory from "./ClipboardHistory";
import Header from "./Header";

const getToastTitle = (type: string) => {
  if (type === "system") return "System notification";
  if (type === "clipboard") {
    return "Clipboard update";
  }
  return "New message";
};

const ClipboardRoom = ({
  roomCode,
  isConnected,
  setIsConnected,
  onLeaveRoom,
}: ClipboardRoomProps) => {
  const { history, copy, messages, shareText, clipboardError } = useClipboard(
    roomCode,
    setIsConnected
  );
  const { toast } = useToast();
  const initializedRef = useRef(false);
  const messageCountRef = useRef(0);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      messageCountRef.current = messages.length;
      return;
    }

    if (messages.length > messageCountRef.current) {
      const newMessages = messages.slice(messageCountRef.current);
      newMessages.forEach((message) => {
        toast({
          title: getToastTitle(message.type),
          description: message.content,
          variant:
            message.type === "system" &&
            message.content.toLowerCase().includes("error")
              ? "destructive"
              : "default",
        });
      });
      messageCountRef.current = messages.length;
    }
  }, [messages, toast]);

  return (
    <main className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
      {/* Header Section */}
      <Header
        roomCode={roomCode}
        isConnected={isConnected}
        clipboardError={clipboardError}
        onLeaveRoom={onLeaveRoom}
      />

      {/* Connection Status Warning */}
      {!isConnected && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-800">
          <WifiOff className="h-4 w-4" />
          Attempting to reconnect...
        </div>
      )}

      {/* Clipboard Error Warning */}
      {clipboardError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {clipboardError}
        </div>
      )}

      {/* Manual Text Share Section */}
      <ManualTextShare onShareText={shareText} isConnected={isConnected} />

      {/* Clipboard History Section */}
      <ClipboardHistory history={history} onCopyItem={copy} />
    </main>
  );
};

export default ClipboardRoom;
