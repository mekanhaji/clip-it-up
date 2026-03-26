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
