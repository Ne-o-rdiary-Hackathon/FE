export interface ActivityItem {
  activity_id: number;
  activity_name: string;
}
export interface ActivitySubcategory {
  category_id: number;
  category_name: string;
  activities: ActivityItem[];
}
export interface ActivityCategory {
  category_id: number;
  category_name: string;
  subcategories: ActivitySubcategory[];
}
export interface ActivitySubmissionRequest {
  desired_activity_ids: number[];
  bored_activity_ids: number[];
}
export interface ActivitySubmissionResponse {
  status: "SUBMITTED";
  all_members_submitted: boolean;
}
