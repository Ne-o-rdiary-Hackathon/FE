import { useMutation } from "@tanstack/react-query";
import { submitActivities } from "@/apis/activities/activities";
import type { ActivitySubmissionRequest } from "@/types/activities";

export const useSubmitActivitiesMutation = () =>
  useMutation({
    mutationFn: ({
      roomId,
      body,
    }: {
      roomId: number;
      body: ActivitySubmissionRequest;
    }) => submitActivities(roomId, body),
  });
