import Image from "next/image";
import Link from "next/link";

import { MOCK_BINGO } from "@/mocks/bingo";

export const BingoScreen = () => (
  <main className="bg-bg-normal text-text-title min-h-dvh">
    <header className="relative flex h-13 items-center justify-center px-5">
      <Link
        href="/"
        aria-label="홈으로"
        className="absolute left-5 flex size-6 items-center justify-center"
      >
        <Image
          src="/icons/bingo/back.svg"
          width={24}
          height={24}
          alt=""
          className="rotate-180"
        />
      </Link>
      <h1 className="body1 leading-[normal] font-bold tracking-[-0.02em]">
        {MOCK_BINGO.roomName}
      </h1>
      <span
        aria-hidden="true"
        className="absolute right-5 flex size-8 items-center justify-center text-lg font-semibold"
      >
        ↻
      </span>
    </header>

    <section
      aria-label="빙고 달성 현황"
      className="bg-bingo-summary mt-3 rounded-[0.875rem] px-4 py-3.5"
    >
      <div className="flex items-center justify-between">
        <p className="body4 font-bold">
          달성 현황{" "}
          <span className="text-primary-normal">
            0 / {MOCK_BINGO.targetBingo} 빙고
          </span>
        </p>
        <p className="text-bingo-muted text-xs leading-[1.4] tracking-[-0.025em]">
          0/9칸 완료
        </p>
      </div>
      <div className="text-bingo-muted mt-2.5 text-xs leading-[1.4] tracking-[-0.025em]">
        <p>🎯 빙고의 가운데 칸은 가장 많은 멤버가 선호하는 활동입니다.</p>
        <p>💡 칸을 눌러 사진을 등록하면 빙고가 채워집니다!</p>
      </div>
    </section>

    <section
      aria-label="빙고판"
      className="mx-auto mt-3 w-full max-w-[25.125rem] px-[1.1875rem]"
    >
      <div className="mx-auto flex max-w-[22.5rem] items-center justify-between px-0.5 py-1">
        <h2 className="body5 font-bold">
          함께하는 멤버 ({MOCK_BINGO.memberCount}명)
        </h2>
      </div>
      <div className="mx-auto mt-2.5 grid max-w-[22.75rem] grid-cols-3 gap-x-2 gap-y-3">
        {MOCK_BINGO.activities.map((activity, index) => (
          <div
            key={activity.join(" ")}
            className="bg-bingo-cell text-primary-darker @container relative flex aspect-[116/112] min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl text-center"
          >
            {index === 4 && (
              <Image
                src="/icons/bingo/center-star.svg"
                alt=""
                width={114}
                height={114}
                className="pointer-events-none absolute max-w-full"
              />
            )}
            <div
              className={`relative translate-y-[min(0.5rem,6.9cqw)] ${index === 4 ? "text-primary-normal" : ""}`}
            >
              <p className="text-[min(0.875rem,12.07cqw)] leading-[1.4] font-semibold tracking-[-0.025em]">
                {activity[0]}
                <br />
                {activity[1]}
              </p>
              <p className="mt-[min(0.5rem,6.9cqw)] text-[min(0.6875rem,9.48cqw)] leading-[1.4] tracking-[-0.025em]">
                미완료
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);
