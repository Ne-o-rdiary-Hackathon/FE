"use client";

import Link from "next/link";
import { useBingoBoardQuery } from "@/hooks/bingo/useBingoBoardQuery";
import { useBingoResultQuery } from "@/hooks/bingo/useBingoResultQuery";
import { useVerifyBingoMutation } from "@/hooks/bingo/useVerifyBingoMutation";
import { HttpError } from "@/lib/api/http-error";
import { BingoScreen } from "./BingoScreen";

export const BingoRoom = ({ roomId }: { roomId: number }) => {
  const board = useBingoBoardQuery(roomId);
  const result = useBingoResultQuery(
    roomId,
    board.data?.room_status === "COMPLETED"
  );
  const verification = useVerifyBingoMutation(roomId);

  if (!board.data) {
    const message = board.isError
      ? board.error instanceof HttpError && board.error.status === 404
        ? "빙고판을 찾을 수 없습니다. 빙고판이 생성된 방인지 확인해 주세요."
        : board.error instanceof HttpError && board.error.status === 403
          ? "이 방의 빙고판을 볼 권한이 없습니다. 참여한 방인지 확인해 주세요."
          : "빙고판을 불러오지 못했습니다."
      : "빙고판을 불러오는 중입니다.";
    return (
      <main className="bg-bg-normal flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="body3 text-text-title">{message}</p>
        {board.isError && (
          <button
            type="button"
            disabled={board.isFetching}
            onClick={() => {
              void board.refetch();
            }}
            className="body3 text-primary-normal"
          >
            다시 시도
          </button>
        )}
        <Link href="/home" className="body3 text-primary-normal">
          홈으로
        </Link>
      </main>
    );
  }

  const view =
    result.data && board.data.room_status === "COMPLETED"
      ? { ...result.data, room_status: "COMPLETED" as const }
      : board.data;
  return (
    <>
      {board.isError && (
        <p role="alert" className="body5 text-red-normal px-5 py-2">
          최신 상태를 불러오지 못했습니다. 새로고침해 주세요.
        </p>
      )}
      {result.isError && (
        <p role="alert" className="body5 text-red-normal px-5 py-2">
          최종 결과를 불러오지 못했습니다. 새로고침해 주세요.
        </p>
      )}
      <BingoScreen
        key={roomId}
        board={view}
        isRefreshing={board.isFetching || result.isFetching}
        onRefresh={() => {
          void board.refetch();
          if (board.data.room_status === "COMPLETED") void result.refetch();
        }}
        onVerify={async (cellId, image) => {
          await verification.mutateAsync({ cellId, image });
        }}
      />
    </>
  );
};
