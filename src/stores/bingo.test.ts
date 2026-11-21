import { afterEach, describe, expect, it, vi } from "vitest";
import { useBingoStore } from "./bingo";

describe("임시 방별 빙고 사진", () => {
  afterEach(() => {
    useBingoStore.setState({ photosByRoom: {} });
    vi.unstubAllGlobals();
  });

  it("방별 사진을 구분하고 완료된 칸의 사진을 바꾸지 않는다", () => {
    const createObjectURL = vi
      .fn<(blob: Blob) => string>()
      .mockReturnValueOnce("blob:first")
      .mockReturnValueOnce("blob:second");
    vi.stubGlobal("URL", { createObjectURL });
    const photo = new Blob(["photo"]);
    useBingoStore.getState().addPhoto(1, 0, photo);
    useBingoStore.getState().addPhoto(1, 0, photo);
    useBingoStore.getState().addPhoto(2, 0, photo);

    expect(useBingoStore.getState().photosByRoom).toEqual({
      1: { 0: "blob:first" },
      2: { 0: "blob:second" },
    });
    expect(createObjectURL).toHaveBeenCalledTimes(2);
  });
});
