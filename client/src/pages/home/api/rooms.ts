import api from "@/lib/api";

interface CreateRoomResponse {
  room_code: string;
}

export const createRoom = async () => {
  const response = await api.post<CreateRoomResponse>("/create-room");
  return response.data.room_code;
};
