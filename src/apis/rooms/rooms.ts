import { api } from "@/lib/api/http-client";
import type { ApiResponse } from "@/types/api";
import type {
  HomeRoomList,
  HomeRoomListParams,
  InviteValidationResponse,
  RoomCreateRequest,
  RoomCreateResponse,
  RoomJoinResponse,
} from "@/types/room";

/** 내가 참여한 방 목록 조회 (GET /api/rooms). */
export const fetchRooms = async (
  params: HomeRoomListParams
): Promise<HomeRoomList> => {
  const response = await api.get<ApiResponse<HomeRoomList>>("/api/rooms", {
    params,
  });
  return response.data;
};

/** 빙고 방 생성 (POST /api/rooms). */
export const createRoom = async (
  body: RoomCreateRequest
): Promise<RoomCreateResponse> => {
  const response = await api.post<ApiResponse<RoomCreateResponse>>(
    "/api/rooms",
    body
  );
  return response.data;
};

export const fetchInviteRoom = async (
  inviteCode: string
): Promise<InviteValidationResponse> => {
  const response = await api.get<ApiResponse<InviteValidationResponse>>(
    `/api/rooms/invite/${encodeURIComponent(inviteCode)}`
  );
  return response.data;
};

export const joinRoom = async (
  inviteCode: string
): Promise<RoomJoinResponse> => {
  const response = await api.post<ApiResponse<RoomJoinResponse>>(
    `/api/rooms/invite/${encodeURIComponent(inviteCode)}/join`
  );
  return response.data;
};
