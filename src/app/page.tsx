"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getKakaoLoginUrl } from "@/apis/auth/auth";
import { KakaoLoginButton } from "@/components/auth/KakaoLoginButton";
import { useMeQuery } from "@/hooks/auth/useMeQuery";

const handleLogin = () => {
  window.location.href = getKakaoLoginUrl();
};

const LoginPage = () => {
  const router = useRouter();
  const { isSuccess } = useMeQuery();

  useEffect(() => {
    if (isSuccess) router.replace("/home");
  }, [isSuccess, router]);

  return (
    <main className="bg-primary-normal flex min-h-dvh flex-col">
      <section className="px-7 pt-14">
        <h1 className="py-2.5">
          <Image
            src="/images/login/logo-wordmark.svg"
            alt="칸칸"
            width={70}
            height={37}
            priority
          />
        </h1>
        <p className="h3 text-text-white mt-7 font-bold">
          지루한 일상을 깨는
          <br />
          우리만의 취향 빙고
        </p>
        <p className="body3 text-primary-light-hover mt-1.5 font-medium opacity-90">
          친구들과 하고 싶은 활동을 고르고
          <br />
          AI가 추천한 빙고 미션을 인증해 보세요.
        </p>
      </section>

      <div className="flex flex-1 items-center justify-end pr-12">
        <div className="relative my-8 flex size-57 items-center justify-center">
          <Image
            src="/images/login/hero-shadow.svg"
            alt=""
            width={200}
            height={28}
            className="absolute top-51.5 left-1/2 -translate-x-1/2"
          />
          <div className="bg-bg-normal relative flex size-49 rotate-10 items-center justify-center rounded-[3rem] shadow-[0_1rem_2rem_rgba(115,33,0,0.25)]">
            <Image
              src="/images/login/logo-symbol.svg"
              alt=""
              width={144}
              height={144}
              priority
            />
          </div>
        </div>
      </div>

      <section className="bg-bg-normal flex flex-col items-center gap-6.5 rounded-t-[1.75rem] px-6 pt-10 pb-16">
        <KakaoLoginButton onClick={handleLogin} />
        <p className="body5 text-text-secondary-2 text-center">
          로그인 시 <span className="underline">서비스 이용약관</span> 및{" "}
          <span className="underline">개인정보 처리방침</span>에 동의합니다.
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
