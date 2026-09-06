import { ROUTES, withBase } from "@/lib/router";

export const generateTempRoomCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const token = Array.from({ length: 6 }, () => {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }).join("");

  return `TEMP-${token}`;
};

export const isServerRoomCode = (roomCode: string) => {
  return /^[A-Z]{6}$/.test(roomCode);
};

export const ROOM_QUERY_PARAM = "room";

/** Absolute, scannable invite URL for a room. Always points at the home route. */
export const buildRoomShareUrl = (code: string) => {
  const url = new URL(withBase(ROUTES.home), window.location.origin);
  url.searchParams.set(ROOM_QUERY_PARAM, code);
  return url.toString();
};

/** The valid room code in the current URL, or null. */
export const readRoomCodeFromUrl = () => {
  const raw = new URLSearchParams(window.location.search).get(
    ROOM_QUERY_PARAM,
  );
  const code = raw?.trim().toUpperCase() ?? "";
  return isServerRoomCode(code) ? code : null;
};

/** Mirrors room state into the URL. Pass null to strip the param. */
export const syncRoomCodeToUrl = (code: string | null) => {
  const url = new URL(window.location.href);

  if (code) {
    url.searchParams.set(ROOM_QUERY_PARAM, code);
  } else if (!url.searchParams.has(ROOM_QUERY_PARAM)) {
    return;
  } else {
    url.searchParams.delete(ROOM_QUERY_PARAM);
  }

  const search = url.searchParams.toString();
  window.history.replaceState(
    null,
    "",
    `${url.pathname}${search ? `?${search}` : ""}${url.hash}`,
  );
};
