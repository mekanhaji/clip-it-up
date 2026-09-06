import { toast } from "@/components/ui/use-toast";
import { useRoomStore, useSocketStore } from "@/store/room";
import { useEffect } from "react";
import { createRoomSocket } from "../api/ws";
import {
  ROOM_QUERY_PARAM,
  readRoomCodeFromUrl,
  syncRoomCodeToUrl,
} from "../utils/room";

// Module scope: survives StrictMode's dev-mode remount so a scanned invite
// link only ever opens one socket.
let deepLinkHandled = false;

/**
 * Joins a room from a `?room=CODE` invite link on first load, and afterwards
 * keeps the URL's `?room=` param mirroring the active room so refreshing or
 * sharing the address bar always rejoins the right place.
 */
export const useRoomUrlSync = () => {
  const { code, updateRoomCode } = useRoomStore();
  const { setSocket } = useSocketStore();

  useEffect(() => {
    if (deepLinkHandled) {
      return;
    }
    deepLinkHandled = true;

    const params = new URLSearchParams(window.location.search);
    if (!params.has(ROOM_QUERY_PARAM)) {
      return;
    }

    const joinCode = readRoomCodeFromUrl();
    if (!joinCode) {
      syncRoomCodeToUrl(null);
      toast({
        variant: "destructive",
        title: "invalid invite link",
        description: "that link doesn't contain a valid room code.",
      });
      return;
    }

    setSocket(createRoomSocket(joinCode));
    updateRoomCode(joinCode);
    toast({
      title: "joined room",
      description: `you joined room ${joinCode}.`,
    });
  }, [setSocket, updateRoomCode]);

  useEffect(() => {
    syncRoomCodeToUrl(useRoomStore.getState().code);
  }, [code]);
};
