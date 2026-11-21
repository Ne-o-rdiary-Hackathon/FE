import { HttpError } from "@/lib/api/http-error";

export const getSubmissionErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 403)
      return "이 방의 참여자만 활동을 제출할 수 있습니다.";
    if (error.status === 409)
      return "현재 방 상태에서는 제출할 수 없습니다. 방 상태를 확인해 주세요.";
  }
  return "선택을 제출하지 못했습니다. 다시 시도해 주세요.";
};
