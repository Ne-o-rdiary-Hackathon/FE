import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchActivities, submitActivities } from "./activities";

afterEach(() => vi.unstubAllGlobals());

describe("활동 API", () => {
  it("서버의 활동 목록을 반환한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            data: {
              categories: [
                {
                  category_id: 1,
                  category_name: "스포츠",
                  subcategories: [],
                },
              ],
            },
            error: null,
          }),
          { headers: { "content-type": "application/json" } }
        )
      )
    );
    expect(await fetchActivities()).toEqual([
      { category_id: 1, category_name: "스포츠", subcategories: [] },
    ]);
  });

  it("방 ID와 선택한 활동 ID를 제출하고 인증 쿠키를 포함한다", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { status: "SUBMITTED", all_members_submitted: false },
          error: null,
        }),
        { headers: { "content-type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);
    await submitActivities(12, {
      desired_activity_ids: [2],
      bored_activity_ids: [1],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/rooms/12/responses/me/submit"),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          desired_activity_ids: [2],
          bored_activity_ids: [1],
        }),
      })
    );
  });

  it("실패 응답을 성공으로 처리하지 않는다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: false,
            data: null,
            error: { message: "실패" },
          }),
          { headers: { "content-type": "application/json" } }
        )
      )
    );
    await expect(fetchActivities()).rejects.toThrow("실패");
  });

  it("인증에 실패하면 제출 결과를 반환하지 않는다", async () => {
    const replace = vi.fn<(url: string) => void>();
    vi.stubGlobal("window", { location: { replace } });
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({ success: false, data: null, error: null }),
          {
            status: 401,
            headers: { "content-type": "application/json" },
          }
        )
      )
    );
    await expect(
      submitActivities(12, {
        desired_activity_ids: [2],
        bored_activity_ids: [1],
      })
    ).rejects.toMatchObject({ status: 401 });
    expect(replace).toHaveBeenCalledWith("/");
  });
});
