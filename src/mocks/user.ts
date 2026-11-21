import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

export const currentUserResponse: ApiResponse<User> = {
  success: true,
  data: {
    user_id: 1,
    nickname: "김민지",
    profile_image_url: "https://example.com/profile.jpg",
  },
};
