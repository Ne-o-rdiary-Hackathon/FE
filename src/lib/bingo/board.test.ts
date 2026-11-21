import { describe, expect, it } from "vitest";
import { getServerBingoLines } from "./board";

describe("서버 빙고 판정 표시", () => {
  it("칸 ID를 위치로 변환해 서버가 알려준 빙고 줄을 표시한다", () => {
    const cells = [
      { cell_id: 15, position: 1 },
      { cell_id: 16, position: 2 },
      { cell_id: 12, position: 0 },
      { cell_id: 10, position: 4 },
    ];
    expect(getServerBingoLines(cells, [12, 15, 16])).toEqual([[0, 1, 2]]);
    expect(getServerBingoLines(cells, [10])).toEqual([]);
  });
});
