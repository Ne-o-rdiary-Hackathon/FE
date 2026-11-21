import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchMe } from "./auth";

afterEach(() => vi.unstubAllGlobals());

describe("로그인 상태 조회", () => {
  it("인증 쿠키와 함께 사용자 정보를 조회한다", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          user_id: 1,
          nickname: "사용자",
          profile_image_url: null,
        }),
        { headers: { "content-type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchMe()).toMatchObject({ user_id: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/me"),
      expect.objectContaining({ method: "GET", credentials: "include" })
    );
  });

  it("로그인 상태 조회에서 인증 실패 시 강제 이동 없이 오류를 반환한다", async () => {
    const replace = vi.fn<(url: string) => void>();
    vi.stubGlobal("window", { location: { replace } });
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response(null, { status: 401 }))
    );
    await expect(fetchMe()).rejects.toMatchObject({ status: 401 });
    expect(replace).not.toHaveBeenCalled();
  });
});
