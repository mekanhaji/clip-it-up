import { useEffect, useRef, useState } from "react";
import type { ConnectionState, WireMessage } from "@/pages/home/types";

const WS_ENDPOINT = import.meta.env.VITE_WS;

interface UseRoomRealtimeProps {
  roomCode: string;
  enabled: boolean;
  onClipboardMessage: (content: string) => void;
}

interface UseRoomRealtimeResult {
  connectionState: ConnectionState;
  sendClipboardMessage: (content: string) => void;
}

export const useRoomRealtime = ({
  roomCode,
  enabled,
  onClipboardMessage,
}: UseRoomRealtimeProps): UseRoomRealtimeResult => {
  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnectRef = useRef(false);
  const queuedMessagesRef = useRef<string[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    enabled ? "connecting" : "idle",
  );

  useEffect(() => {
    if (!enabled || !WS_ENDPOINT) {
      shouldReconnectRef.current = false;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnectionState(enabled ? "disconnected" : "idle");
      return;
    }

    shouldReconnectRef.current = true;
    let reconnectTimer: number | undefined;

    const connect = () => {
      setConnectionState("connecting");
      const ws = new WebSocket(`${WS_ENDPOINT}/ws?room=${roomCode}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState("connected");
        while (queuedMessagesRef.current.length > 0) {
          const queued = queuedMessagesRef.current.shift();
          if (!queued) {
            break;
          }
          ws.send(queued);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WireMessage;
          if (message.type === "clipboard" || message.type === "text") {
            onClipboardMessage(message.content);
          }
        } catch {
          // Ignore malformed messages and keep connection alive.
        }
      };

      ws.onerror = () => {
        setConnectionState("disconnected");
      };

      ws.onclose = () => {
        setConnectionState("disconnected");
        if (shouldReconnectRef.current) {
          reconnectTimer = window.setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled, onClipboardMessage, roomCode]);

  const sendClipboardMessage = (content: string) => {
    if (!content.trim()) {
      return;
    }

    const payload: WireMessage = {
      type: "clipboard",
      content,
      room: roomCode,
    };
    const payloadString = JSON.stringify(payload);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      queuedMessagesRef.current.push(payloadString);
      return;
    }

    wsRef.current.send(payloadString);
  };

  return {
    connectionState,
    sendClipboardMessage,
  };
};
