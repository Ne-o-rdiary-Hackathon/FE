import { useQuery } from "@tanstack/react-query";
import { fetchActivities } from "@/apis/activities/activities";
import { activityKeys } from "@/apis/activities/keys";

export const useActivitiesQuery = () =>
  useQuery({ queryKey: activityKeys.all, queryFn: fetchActivities });
