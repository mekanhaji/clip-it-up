export type RoomMode = "temp" | "server";

export type ConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected";

export interface ClipboardEntry {
  id: string;
  content: string;
  source: "local" | "remote";
  createdAt: number;
  pinned?: boolean;
  /** Device name of the remote sender, when it was provided. */
  sender?: string;
}

export interface WireMessage {
  type: string;
  content: string;
  room: string;
  /** Optional device name of the sender; older clients and servers omit it. */
  sender?: string;
}

export interface ActionDefinition {
  key: string;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}
