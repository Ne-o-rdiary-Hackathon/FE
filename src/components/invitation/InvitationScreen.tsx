"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { IcCheck } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

const MOCK_INVITATION = {
  roomName: "퇴근 후 도파민 수혈단",
  memberCount: 4,
  targetBingo: 3,
  inviteUrl: "https://kankan.app/invite/8X92K",
};
const TOAST_DURATION_MS = 2000;

export const InvitationScreen = () => {
  const router = useRouter();
  const [copyResult, setCopyResult] = useState<"success" | "failure" | null>(
    null
  );
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const showCopyResult = (result: "success" | "failure") => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setCopyResult(result);
    timerRef.current = window.setTimeout(() => {
      setCopyResult(null);
      timerRef.current = null;
    }, TOAST_DURATION_MS);
  };

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(MOCK_INVITATION.inviteUrl);
      showCopyResult("success");
    } catch {
      showCopyResult("failure");
    }
  };

  return (
    <main className="bg-bg-normal text-text-primary flex min-h-dvh flex-col">
      <header className="relative flex h-13 shrink-0 items-center justify-center px-5">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="초대장 닫기"
          className="focus-visible:outline-primary-normal absolute left-5 flex size-8 items-center justify-center text-lg font-semibold focus-visible:outline-2"
        >
          <Image
            src="/images/invitation/close.png"
            width={32}
            height={32}
            alt=""
          />
        </button>
        <h1 className="body1 font-bold">초대장 보내기</h1>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 pb-27">
        <div className="w-full max-w-78.5">
          <div className="flex flex-col items-center text-center">
            <span className="bg-primary-light text-primary-normal rounded-pill px-2.5 py-1 text-xs leading-[1.4] font-medium tracking-tight">
              방 생성 완료!
            </span>
            <span className="bg-primary-light mt-5 flex size-15 items-center justify-center rounded-full">
              <Image
                src="/images/invitation/envelope.svg"
                width={26}
                height={26}
                alt=""
              />
            </span>
            <div className="mt-5">
              <p className="body4 text-primary-normal font-semibold">
                친구들을 초대하고 함께 빙고판을 채워보세요
              </p>
              <h2 className="mt-1 text-[1.375rem] leading-[1.4] font-bold tracking-tight">
                {MOCK_INVITATION.roomName}
              </h2>
            </div>
          </div>

          <div className="mt-5">
            <div className="bg-bg-gray rounded-16 flex flex-col gap-2.5 p-4">
              <div className="flex items-center justify-between">
                <span className="body5 text-text-secondary-1">방 인원수</span>
                <span className="body4 text-primary-normal font-bold">
                  {MOCK_INVITATION.memberCount}명
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="body5 text-text-secondary-1">목표 빙고</span>
                <span className="body4 font-semibold">
                  {MOCK_INVITATION.targetBingo}줄 빙고
                </span>
              </div>
              <input
                aria-label="초대 링크"
                readOnly
                value={MOCK_INVITATION.inviteUrl}
                onFocus={(event) => event.currentTarget.select()}
                className="body5 border-border-1 bg-bg-normal text-text-secondary-1 focus-visible:outline-primary-normal mt-1 h-11 w-full min-w-0 rounded-xl border px-4 focus-visible:outline-2"
              />
            </div>
            <Button
              type="button"
              onClick={handleCopy}
              className="body2 mt-2.5 h-13 w-full rounded-xl font-medium"
            >
              초대 링크 복사
            </Button>
          </div>
        </div>
      </div>
      {copyResult && (
        <Toast
          message={
            copyResult === "success"
              ? "링크가 복사 됐습니다."
              : "복사에 실패했어요"
          }
          icon={
            copyResult === "success" ? (
              <span className="bg-primary-normal text-text-white flex size-6 items-center justify-center rounded-full">
                <IcCheck size={16} />
              </span>
            ) : undefined
          }
        />
      )}
    </main>
  );
};
