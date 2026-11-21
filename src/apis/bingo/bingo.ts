import { api } from "@/lib/api/http-client";
import { HttpError } from "@/lib/api/http-error";
import type {
  BingoBoardResponse,
  BingoBoardDto,
  BingoResultDto,
  BingoVerificationDto,
} from "@/types/bingo";

/** 제출된 취향으로 빙고판을 만들고 방을 IN_PROGRESS로 바꾼다. */
export const createBingoBoard = async (
  roomId: number
): Promise<BingoBoardResponse> => {
  const response = await api.post<BingoResponse<BingoBoardResponse>>(
    `/api/rooms/${roomId}/bingo-board`
  );
  return unwrap(response);
};

interface BingoResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
}

const unwrap = <T>(response: BingoResponse<T>): T => {
  if (!response.success || response.data === null)
    throw new Error(
      response.error?.message ?? "빙고 정보를 처리하지 못했습니다."
    );
  return response.data;
};

export const fetchBingoBoard = async (roomId: number): Promise<BingoBoardDto> =>
  unwrap(
    await api.get<BingoResponse<BingoBoardDto>>(
      `/api/rooms/${roomId}/bingo-board`
    )
  );

/** 생성 요청의 응답이 유실됐을 수 있으므로 기존 판을 먼저 확인한다. */
export const createOrFetchBingoBoard = async (
  roomId: number
): Promise<BingoBoardDto> => {
  try {
    return await fetchBingoBoard(roomId);
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 404) throw error;
  }
  try {
    return await createBingoBoard(roomId);
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 409) throw error;
    return fetchBingoBoard(roomId);
  }
};

export const fetchBingoResult = async (
  roomId: number
): Promise<BingoResultDto> =>
  unwrap(
    await api.get<BingoResponse<BingoResultDto>>(`/api/rooms/${roomId}/result`)
  );

export const verifyBingoCell = async (
  roomId: number,
  cellId: number,
  image: Blob
): Promise<BingoVerificationDto> => {
  if (image.size === 0 || image.size > 10 * 1024 * 1024)
    throw new Error("인증 사진은 10MB 이하의 파일이어야 합니다.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(image.type))
    throw new Error("인증 사진은 JPG, PNG, WEBP 형식이어야 합니다.");
  const body = new FormData();
  const extension =
    image.type === "image/jpeg"
      ? "jpg"
      : image.type === "image/png"
        ? "png"
        : "webp";
  body.append("image", image, `verification.${extension}`);
  return unwrap(
    await api.post<BingoResponse<BingoVerificationDto>>(
      `/api/rooms/${roomId}/bingo-board/cells/${cellId}/verification`,
      body
    )
  );
};
