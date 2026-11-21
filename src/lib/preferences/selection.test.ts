import { describe, expect, it } from "vitest";

import { toggleActivity, toggleGroup } from "./selection";

describe("활동 선택", () => {
  it("선택한 활동을 다시 누르면 해제한다", () => {
    expect(toggleActivity(["a"], "a")).toEqual([]);
    expect(toggleActivity(["a"], "b")).toEqual(["a", "b"]);
  });

  it("전체 선택은 다른 항목을 유지하고 그룹만 선택하거나 해제한다", () => {
    expect(toggleGroup(["x", "a"], ["a", "b"])).toEqual(["x", "a", "b"]);
    expect(toggleGroup(["x", "a", "b"], ["a", "b"])).toEqual(["x"]);
  });
});
