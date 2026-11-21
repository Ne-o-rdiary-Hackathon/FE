import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createOrFetchBingoBoard } from "@/apis/bingo/bingo";
import { bingoKeys } from "@/apis/bingo/keys";
import { roomKeys } from "@/apis/rooms/keys";

export const useCreateBingoBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrFetchBingoBoard,
    networkMode: "always",
    retry: false,
    onSuccess: (board, roomId) => {
      queryClient.setQueryData(bingoKeys.board(roomId), board);
      void queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
};
