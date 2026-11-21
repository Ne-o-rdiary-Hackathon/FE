import { describe, expect, it } from "vitest";
import { getBingoProgress } from "./room";

describe("getBingoProgress", () => {
  it("derives cell and line counts from the same room photos", () => {
    expect(getBingoProgress({ 0: "a", 1: "b", 2: "c", 4: "d" })).toEqual({
      completedCells: 4,
      completedBingos: 1,
    });
    expect(getBingoProgress({})).toEqual({
      completedCells: 0,
      completedBingos: 0,
    });
  });
});
