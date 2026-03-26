import { useCallback, useState } from "react";
import { createRoom } from "@/pages/home/api/rooms";
import {
  generateTempRoomCode,
  isServerRoomCode,
} from "@/pages/home/utils/room";
import type { RoomMode } from "@/pages/home/types";

interface UseRoomSessionResult {
  roomCode: string;
  roomMode: RoomMode;
  setServerRoom: (roomCode: string) => void;
  ensureServerRoom: () => Promise<string>;
  resetToTempRoom: () => void;
}

export const useRoomSession = (): UseRoomSessionResult => {
  const [roomCode, setRoomCode] = useState(() => generateTempRoomCode());
  const [roomMode, setRoomMode] = useState<RoomMode>("temp");

  const setServerRoom = useCallback((nextRoomCode: string) => {
    if (!isServerRoomCode(nextRoomCode)) {
      throw new Error("Room code must be 6 uppercase letters.");
    }

    setRoomCode(nextRoomCode);
    setRoomMode("server");
  }, []);

  const ensureServerRoom = useCallback(async () => {
    if (roomMode === "server") {
      return roomCode;
    }

    const createdRoomCode = await createRoom();
    setRoomCode(createdRoomCode);
    setRoomMode("server");
    return createdRoomCode;
  }, [roomCode, roomMode]);

  const resetToTempRoom = useCallback(() => {
    setRoomCode(generateTempRoomCode());
    setRoomMode("temp");
  }, []);

  return {
    roomCode,
    roomMode,
    setServerRoom,
    ensureServerRoom,
    resetToTempRoom,
  };
};
