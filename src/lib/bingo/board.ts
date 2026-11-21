import { getCompletedLines } from "./lines";
import type { BingoCellDto } from "@/types/bingo";

export const getServerBingoLines = (
  cells: Pick<BingoCellDto, "cell_id" | "position">[],
  bingoCellIds: number[]
) =>
  getCompletedLines(
    new Set(
      cells
        .filter((cell) => bingoCellIds.includes(cell.cell_id))
        .map((cell) => cell.position)
    )
  );
