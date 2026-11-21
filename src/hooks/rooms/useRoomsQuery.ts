import { useQuery } from "@tanstack/react-query";

import { roomKeys } from "@/apis/rooms/keys";
import { fetchRooms } from "@/apis/rooms/rooms";
import type { HomeRoomListParams } from "@/types/room";

export const useRoomsQuery = (params: HomeRoomListParams) =>
  useQuery({
    queryKey: roomKeys.list(params),
    queryFn: () => fetchRooms(params),
  });
