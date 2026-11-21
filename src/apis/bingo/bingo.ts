import { api } from "@/lib/api/http-client";
import type { ApiResponse } from "@/types/api";
import type { BingoBoardResponse } from "@/types/bingo";

/** 제출된 취향으로 빙고판을 만들고 방을 IN_PROGRESS로 바꾼다. */
export const createBingoBoard = async (
  roomId: number
): Promise<BingoBoardResponse> => {
  const response = await api.post<ApiResponse<BingoBoardResponse>>(
    `/api/rooms/${roomId}/bingo-board`
  );
  return response.data;
};
