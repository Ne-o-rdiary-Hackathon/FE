import { api, API_BASE_URL } from "@/lib/api/http-client";
import type { AuthUserDto } from "@/types/auth";

// fetch가 아닌 브라우저 전체 이동으로 열어야 서버의 state 쿠키가 동작한다.
export const getKakaoLoginUrl = () => `${API_BASE_URL}/api/auth/kakao/login`;

export const fetchMe = async (): Promise<AuthUserDto> =>
  api.get<AuthUserDto>("/api/auth/me", { shouldSkipAuthRedirect: true });
