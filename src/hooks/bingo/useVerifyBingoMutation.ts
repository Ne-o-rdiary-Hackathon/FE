import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyBingoCell } from "@/apis/bingo/bingo";
import { bingoKeys } from "@/apis/bingo/keys";
import { roomKeys } from "@/apis/rooms/keys";
import type { BingoBoardDto } from "@/types/bingo";
import { applyVerification } from "@/lib/bingo/verification";

export const useVerifyBingoMutation = (roomId: number) => {
  const client = useQueryClient();
  return useMutation({
    networkMode: "always",
    retry: false,
    onMutate: async () => {
      await client.cancelQueries({ queryKey: bingoKeys.board(roomId) });
    },
    mutationFn: ({ cellId, image }: { cellId: number; image: Blob }) =>
      verifyBingoCell(roomId, cellId, image),
    onSuccess: (result) => {
      client.setQueryData<BingoBoardDto>(
        bingoKeys.board(roomId),
        (board) => board && applyVerification(board, result)
      );
      void client.invalidateQueries({ queryKey: bingoKeys.board(roomId) });
      void client.invalidateQueries({ queryKey: bingoKeys.result(roomId) });
      void client.invalidateQueries({ queryKey: roomKeys.lists() });
    },
    onError: () => {
      void client.invalidateQueries({ queryKey: bingoKeys.board(roomId) });
    },
  });
};
