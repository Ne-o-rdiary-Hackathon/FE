import type { BingoBoardDto, BingoVerificationDto } from "@/types/bingo";

export const applyVerification = (
  board: BingoBoardDto,
  result: BingoVerificationDto
): BingoBoardDto => ({
  ...board,
  cells: board.cells.map((cell) =>
    cell.cell_id === result.cell.cell_id ? result.cell : cell
  ),
  achieved_bingo: result.achieved_bingo,
  completed_cells: result.completed_cells,
  bingo_cell_ids: result.bingo_cell_ids,
  room_status: result.room_completed ? "COMPLETED" : board.room_status,
});
