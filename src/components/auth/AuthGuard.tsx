"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useMeQuery } from "@/hooks/auth/useMeQuery";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { isSuccess, isError } = useMeQuery();

  useEffect(() => {
    if (isError) router.replace("/");
  }, [isError, router]);

  if (!isSuccess) {
    return (
      <main className="bg-bg-normal flex min-h-dvh items-center justify-center">
        <p className="body3 text-text-secondary-2">
          로그인 정보를 확인하고 있어요...
        </p>
      </main>
    );
  }

  return children;
};
