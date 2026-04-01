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
}

export interface WireMessage {
  type: string;
  content: string;
  room: string;
}

export interface ActionDefinition {
  key: string;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}
