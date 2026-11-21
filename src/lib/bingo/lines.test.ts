import { describe, expect, it } from "vitest";
import { getCompletedLines } from "./lines";

describe("getCompletedLines", () => {
  it("counts completed rows, columns and diagonals independently", () => {
    expect(getCompletedLines(new Set([0, 1, 2, 3, 4, 6, 8]))).toEqual([
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [2, 4, 6],
    ]);
  });
  it("does not count incomplete lines", () => {
    expect(getCompletedLines(new Set([0, 1, 4, 8]))).toEqual([[0, 4, 8]]);
    expect(getCompletedLines(new Set([0, 1]))).toEqual([]);
  });
});
