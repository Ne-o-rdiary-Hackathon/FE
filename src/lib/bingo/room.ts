import { getCompletedLines } from "./lines";

export const getBingoProgress = (photos: Readonly<Record<number, string>>) => {
  const completedCells = Object.keys(photos).map(Number);
  return {
    completedCells: completedCells.length,
    completedBingos: getCompletedLines(new Set(completedCells)).length,
  };
};
