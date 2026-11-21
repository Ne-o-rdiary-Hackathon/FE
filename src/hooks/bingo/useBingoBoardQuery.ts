import { useQuery } from "@tanstack/react-query";
import { fetchBingoBoard } from "@/apis/bingo/bingo";
import { bingoKeys } from "@/apis/bingo/keys";
import { HttpError } from "@/lib/api/http-error";

export const useBingoBoardQuery = (roomId: number) =>
  useQuery({
    queryKey: bingoKeys.board(roomId),
    queryFn: () => fetchBingoBoard(roomId),
    staleTime: 0,
    networkMode: "always",
    refetchOnWindowFocus: true,
    retry: (count, error) =>
      !(error instanceof HttpError && error.status < 500) && count < 1,
  });
