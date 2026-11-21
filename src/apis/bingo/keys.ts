export const bingoKeys = {
  all: ["bingo"] as const,
  board: (roomId: number) => [...bingoKeys.all, roomId, "board"] as const,
  result: (roomId: number) => [...bingoKeys.all, roomId, "result"] as const,
};
