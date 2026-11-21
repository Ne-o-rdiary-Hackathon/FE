import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBingoBoard } from "@/apis/bingo/bingo";
import { roomKeys } from "@/apis/rooms/keys";

export const useCreateBingoBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBingoBoard,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() }),
  });
};
