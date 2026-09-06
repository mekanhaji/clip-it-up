import type { WireMessage } from "@/pages/home/types";
import { sanitizeDeviceName } from "@/utils/deviceName";

export type RoomSocket = WebSocket;

const WS_ENDPOINT = import.meta.env.VITE_WS;
const SERVER_ENDPOINT = import.meta.env.VITE_SERVER;

const resolveSocketUrl = (roomCode: string) => {
  const rawBase = WS_ENDPOINT || SERVER_ENDPOINT || "ws://localhost:8080";
  const normalizedBase = rawBase
    .replace(/^http:/, "ws:")
    .replace(/^https:/, "wss:");

  const url = new URL(normalizedBase);
  const hasWsPath = /\/ws\/?$/.test(url.pathname);
  if (!hasWsPath) {
    url.pathname = `${url.pathname.replace(/\/$/, "")}/ws`;
  }

  url.searchParams.set("room", roomCode);
  return url.toString();
};

/**
 * Bounds a sender name for the wire in both directions: names we send are
 * kept tidy, and names we receive are untrusted so they get the same cap.
 * Returns undefined when there is nothing usable.
 */
const normalizeSender = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const sender = sanitizeDeviceName(value).trim();
  return sender || undefined;
};

/**
 * Creates and connects a WebSocket client to the specified room endpoint.
 * @param roomCode The code of the room to join.
 * @returns A connected RoomSocket instance.
 */
export const createRoomSocket = (roomCode: string): RoomSocket => {
  return new WebSocket(resolveSocketUrl(roomCode));
};

/**
 * Subscribes to clipboard-related events from the server and invokes the provided callback when a message is received. Returns an unsubscribe function to clean up event listeners when no longer needed.
 * @param socket The RoomSocket instance to subscribe to.
 * @param onClipboardMessage Callback receiving the clip content and, when the sender provided one, its device name.
 * @returns A function that can be called to unsubscribe from the events.
 */
export const subscribeClipboardEvents = (
  socket: RoomSocket,
  onClipboardMessage: (content: string, sender?: string) => void,
) => {
  const handleIncoming = (event: MessageEvent) => {
    try {
      const payload = JSON.parse(String(event.data)) as WireMessage;
      if (
        (payload.type !== "clipboard" && payload.type !== "text") ||
        !payload.content
      ) {
        return;
      }

      onClipboardMessage(payload.content, normalizeSender(payload.sender));
    } catch {
      // Ignore malformed messages.
    }
  };

  socket.addEventListener("message", handleIncoming);

  return () => {
    socket.removeEventListener("message", handleIncoming);
  };
};

export const emitClipboardMessage = (
  socket: RoomSocket,
  roomCode: string,
  content: string,
  sender?: string,
) => {
  const value = content.trim();
  if (!value) {
    return;
  }

  const payload: WireMessage = {
    type: "clipboard",
    room: roomCode,
    content: value,
  };

  const senderName = normalizeSender(sender);
  if (senderName) {
    payload.sender = senderName;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(payload));
};

export const disconnectRoomSocket = (socket: RoomSocket, roomCode: string) => {
  void roomCode;
  socket.close();
};
