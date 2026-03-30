import type { RoomSocket } from "@/pages/home/api/ws";
import { create } from "zustand";

export interface Room {
  // code will be null if not connected
  code: string | null;
  status: "connected" | "connecting" | "disconnected";

  //   set the room code and updates room status to `connected`
  updateRoomCode: (code: string) => void;
  //   update the room status
  updateStatus: (status: "connected" | "connecting" | "disconnected") => void;
  //  leaveRoom clears the room code and sets status to `disconnected`
  leaveRoom: () => void;
}

export const useRoomStore = create<Room>((set) => ({
  code: null,
  status: "disconnected",
  updateRoomCode: (code) => set({ code, status: "connected" }),
  updateStatus: (status) => set({ status }),
  leaveRoom: () => {
    set({ code: null, status: "disconnected" });
  },
}));

export interface SocketStore {
  socket: RoomSocket | null;
  setSocket: (socket: RoomSocket | null) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket: RoomSocket | null) => set({ socket }),
}));
