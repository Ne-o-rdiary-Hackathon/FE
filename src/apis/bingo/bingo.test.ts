import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchBingoBoard,
  fetchBingoResult,
  verifyBingoCell,
  createOrFetchBingoBoard,
} from "./bingo";

afterEach(() => vi.unstubAllGlobals());
const response = (data: unknown) =>
  new Response(JSON.stringify({ success: true, data, error: null }), {
    headers: { "content-type": "application/json" },
  });

describe("빙고 API", () => {
  it("생성 응답을 받지 못한 후 재시도할 때 기존 빙고판이 있으면 다시 생성하지 않는다", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ room_name: "확인", cells: [] }));
    vi.stubGlobal("fetch", fetchMock);
    await createOrFetchBingoBoard(12);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
  });
  it("빙고판이 없을 때만 생성 요청을 보낸다", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(response({ room_name: "확인", cells: [] }));
    vi.stubGlobal("fetch", fetchMock);
    await createOrFetchBingoBoard(12);
    expect(fetchMock.mock.calls.map(([, init]) => init?.method)).toEqual([
      "GET",
      "POST",
    ]);
  });
  it("조회 권한이나 서버 오류를 빙고판 없음으로 처리하지 않는다", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(createOrFetchBingoBoard(12)).rejects.toMatchObject({
      status: 500,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("생성 충돌 후 실제 빙고판 조회가 성공해야 복구한다", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(new Response(null, { status: 409 }))
      .mockResolvedValueOnce(new Response(null, { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(createOrFetchBingoBoard(12)).rejects.toMatchObject({
      status: 404,
    });
  });
  it("지원하지 않는 사진은 서버에 보내지 않는다", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      verifyBingoCell(12, 10, new Blob(["photo"], { type: "text/plain" }))
    ).rejects.toThrow("형식");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("실제 방 ID로 빙고판을 조회한다", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ room_name: "확인", cells: [] }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchBingoBoard(12)).toMatchObject({ room_name: "확인" });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/rooms/12/bingo-board"),
      expect.objectContaining({ credentials: "include" })
    );
  });
  it("사진을 칸 ID로 multipart 업로드하고 JSON 헤더를 지정하지 않는다", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ room_completed: false }));
    vi.stubGlobal("fetch", fetchMock);
    await verifyBingoCell(12, 10, new Blob(["photo"], { type: "image/jpeg" }));
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/rooms/12/bingo-board/cells/10/verification");
    expect(options?.body).toBeInstanceOf(FormData);
    const form = options?.body;
    expect(form instanceof FormData && form.get("image")).toBeInstanceOf(Blob);
    expect(new Headers(options?.headers).has("Content-Type")).toBe(false);
  });
  it("서버가 실패로 응답하면 사진을 완료 처리하지 않는다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: false,
            data: null,
            error: {
              code: "ALREADY_VERIFIED",
              message: "이미 인증된 칸입니다.",
            },
          }),
          { status: 409, headers: { "content-type": "application/json" } }
        )
      )
    );
    await expect(
      verifyBingoCell(12, 10, new Blob(["photo"], { type: "image/jpeg" }))
    ).rejects.toMatchObject({ status: 409 });
  });
  it("완료된 방 결과를 조회한다", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ achieved_bingo: 1 }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchBingoResult(12)).toMatchObject({ achieved_bingo: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/rooms/12/result"),
      expect.objectContaining({ method: "GET" })
    );
  });
});
