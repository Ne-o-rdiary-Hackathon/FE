import { api } from "@/lib/api/http-client";
import type {
  ActivityCategory,
  ActivitySubmissionRequest,
  ActivitySubmissionResponse,
} from "@/types/activities";

interface ActivityApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { message?: string } | null;
}

const unwrap = <T>(response: ActivityApiResponse<T>): T => {
  if (!response.success || response.data === null)
    throw new Error(response.error?.message ?? "요청을 처리하지 못했습니다.");
  return response.data;
};

export const fetchActivities = async (): Promise<ActivityCategory[]> => {
  const response =
    await api.get<ActivityApiResponse<{ categories: ActivityCategory[] }>>(
      "/api/v1/activities"
    );
  return unwrap(response).categories;
};

export const submitActivities = async (
  roomId: number,
  body: ActivitySubmissionRequest
): Promise<ActivitySubmissionResponse> => {
  const response = await api.post<
    ActivityApiResponse<ActivitySubmissionResponse>
  >(`/api/v1/rooms/${roomId}/responses/me/submit`, body);
  return unwrap(response);
};
