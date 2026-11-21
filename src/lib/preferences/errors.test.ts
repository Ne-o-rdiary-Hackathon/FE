import { describe, expect, it } from "vitest";
import { HttpError } from "@/lib/api/http-error";
import { getSubmissionErrorMessage } from "./errors";

describe("활동 제출 오류", () => {
  it("권한 오류에 맞는 안내를 표시한다", () => {
    expect(
      getSubmissionErrorMessage(new HttpError(403, "Forbidden"))
    ).toContain("참여자");
  });

  it("충돌 상태를 무조건 재시도하라고 안내하지 않는다", () => {
    expect(getSubmissionErrorMessage(new HttpError(409, "Conflict"))).toContain(
      "방 상태"
    );
  });
});
