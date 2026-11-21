import { api } from "@/lib/api/http-client";
import type { ApiResponse } from "@/types/api";
import type { HomeRoomList, HomeRoomListParams } from "@/types/room";

/** 내가 참여한 방 목록 조회 (GET /api/rooms). */
export const fetchRooms = async (
  params: HomeRoomListParams
): Promise<HomeRoomList> => {
  const response = await api.get<ApiResponse<HomeRoomList>>("/api/rooms", {
    params,
  });
  return response.data;
};
