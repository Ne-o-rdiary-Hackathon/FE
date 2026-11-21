import { useQuery } from "@tanstack/react-query";
import { fetchBingoResult } from "@/apis/bingo/bingo";
import { bingoKeys } from "@/apis/bingo/keys";

export const useBingoResultQuery = (roomId: number, enabled: boolean) =>
  useQuery({
    queryKey: bingoKeys.result(roomId),
    queryFn: () => fetchBingoResult(roomId),
    enabled,
    networkMode: "always",
  });
