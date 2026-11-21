import { expect, it } from "vitest";
import { applyVerification } from "./verification";
import type { BingoBoardDto, BingoVerificationDto } from "@/types/bingo";

it("인증 응답의 사진, 칸 상태, 빙고 줄과 진행률을 함께 반영한다", () => {
  const cell = {
    cell_id: 10,
    position: 4,
    activity_name: "영화",
    mission_text: "영화 보기",
    score: 1,
    status: "PENDING",
    image_url: null,
  };
  const board: BingoBoardDto = {
    room_name: "확인",
    members: [],
    room_status: "IN_PROGRESS",
    target_bingo: 1,
    achieved_bingo: 0,
    completed_cells: 2,
    bingo_cell_ids: [],
    cells: [cell, { ...cell, cell_id: 12, position: 0 }],
  };
  const result: BingoVerificationDto = {
    cell: {
      ...cell,
      status: "COMPLETED",
      image_url: "https://example.com/photo.jpg",
    },
    achieved_bingo: 1,
    completed_cells: 3,
    new_bingo_cell_ids: [10, 12, 15],
    bingo_cell_ids: [10, 12, 15],
    room_completed: true,
  };
  const updated = applyVerification(board, result);
  expect(updated.cells[0]).toEqual(result.cell);
  expect(updated.cells[1]).toEqual(board.cells[1]);
  expect(updated).toMatchObject({
    achieved_bingo: 1,
    completed_cells: 3,
    bingo_cell_ids: [10, 12, 15],
    room_status: "COMPLETED",
  });
  expect(board.cells[0].status).toBe("PENDING");
});
