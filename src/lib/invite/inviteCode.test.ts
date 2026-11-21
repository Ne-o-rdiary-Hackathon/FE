import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseInviteCode,
  savePendingInviteCode,
  takePendingInviteCode,
} from "./inviteCode";

describe("초대 코드 추출", () => {
  it("초대 링크에서 코드만 꺼낸다", () => {
    expect(
      parseInviteCode("https://kankan-bingo.vercel.app/invite/HLDHXUIY")
    ).toBe("HLDHXUIY");
    expect(parseInviteCode(" https://kankan.app/invite/8X92K?ref=kakao ")).toBe(
      "8X92K"
    );
  });

  it("코드만 입력하면 앞뒤 공백만 지운다", () => {
    expect(parseInviteCode("  HLDHXUIY ")).toBe("HLDHXUIY");
    expect(parseInviteCode("")).toBe("");
  });
});

describe("로그인 전후로 보관하는 초대 코드", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("한 번 꺼내면 지워진다", () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      setItem: (key: string, value: string) => storage.set(key, value),
      getItem: (key: string) => storage.get(key) ?? null,
      removeItem: (key: string) => storage.delete(key),
    });

    savePendingInviteCode("HLDHXUIY");
    expect(takePendingInviteCode()).toBe("HLDHXUIY");
    expect(takePendingInviteCode()).toBeNull();
  });

  it("저장소를 쓸 수 없으면 에러 없이 null을 돌려준다", () => {
    vi.stubGlobal("sessionStorage", {
      setItem: () => {
        throw new Error("blocked");
      },
      getItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {},
    });

    expect(() => savePendingInviteCode("HLDHXUIY")).not.toThrow();
    expect(takePendingInviteCode()).toBeNull();
  });
});
