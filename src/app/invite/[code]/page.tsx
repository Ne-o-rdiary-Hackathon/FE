"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { savePendingInviteCode } from "@/lib/invite/inviteCode";

// 초대 링크로 들어오면 코드를 보관하고 홈으로 보낸다.
// 로그인 전이라면 로그인 후 홈에서 코드가 채워진 참여 창이 열린다.
const InvitePage = () => {
  const router = useRouter();
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    if (code) savePendingInviteCode(decodeURIComponent(code));
    router.replace("/home");
  }, [code, router]);

  return null;
};

export default InvitePage;
