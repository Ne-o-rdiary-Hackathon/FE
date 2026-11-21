"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { MOCK_BINGO } from "@/mocks/bingo";
import { PhotoEditor } from "./PhotoEditor";

export const BingoScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ file: File; cellIndex: number } | null>(
    null
  );
  const [photos, setPhotos] = useState<Record<number, string>>({});
  const photoUrls = useRef<string[]>([]);
  useEffect(
    () => () => photoUrls.current.forEach((url) => URL.revokeObjectURL(url)),
    []
  );
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const completedLines = lines.filter((line) =>
    line.every((index) => photos[index])
  );

  const handleComplete = (blob: Blob) => {
    if (!draft || photos[draft.cellIndex]) return;
    const url = URL.createObjectURL(blob);
    photoUrls.current.push(url);
    setPhotos((current) => ({ ...current, [draft.cellIndex]: url }));
    setDraft(null);
  };

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || selectedIndex === null) return;
    setDraft({ file, cellIndex: selectedIndex });
    setSelectedIndex(null);
  };

  if (draft)
    return (
      <PhotoEditor
        file={draft.file}
        onBack={() => setDraft(null)}
        onComplete={handleComplete}
      />
    );

  return (
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
              {completedLines.length} / {MOCK_BINGO.targetBingo} 빙고
            </span>
          </p>
          <p className="text-bingo-muted text-xs leading-[1.4] tracking-[-0.025em]">
            {Object.keys(photos).length}/9칸 완료
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
        <div className="relative mx-auto mt-2.5 grid max-w-[22.75rem] grid-cols-3 gap-x-2 gap-y-3">
          {MOCK_BINGO.activities.map((activity, index) => (
            <button
              type="button"
              key={activity.join(" ")}
              disabled={Boolean(photos[index])}
              aria-pressed={selectedIndex === index}
              onClick={() =>
                setSelectedIndex(selectedIndex === index ? null : index)
              }
              className={`bg-bingo-cell text-primary-darker @container relative flex aspect-[116/112] min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl text-center ${selectedIndex === index ? "ring-primary-normal ring-1 ring-inset" : ""}`}
            >
              {photos[index] && (
                <>
                  <Image
                    src={photos[index]}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 402px) 33vw, 116px"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-black/50" />
                </>
              )}
              {index === 4 && !photos[index] && (
                <Image
                  src="/icons/bingo/center-star.svg"
                  alt=""
                  width={114}
                  height={114}
                  className="pointer-events-none absolute max-w-full"
                />
              )}
              <div
                className={`relative translate-y-[min(0.5rem,6.9cqw)] ${photos[index] ? "text-white" : index === 4 ? "text-primary-normal" : ""}`}
              >
                <p className="text-[min(0.875rem,12.07cqw)] leading-[1.4] font-semibold tracking-[-0.025em]">
                  {activity[0]}
                  <br />
                  {activity[1]}
                </p>
                <p className="mt-[min(0.5rem,6.9cqw)] text-[min(0.6875rem,9.48cqw)] leading-[1.4] tracking-[-0.025em]">
                  {photos[index] ? "인증완료" : "미완료"}
                </p>
              </div>
            </button>
          ))}
          {selectedIndex !== null && (
            <div
              className="bg-bingo-menu absolute bottom-0 left-1/2 z-10 w-55 -translate-x-1/2 translate-y-1/2 overflow-hidden rounded-xl backdrop-blur-sm"
              aria-label="사진 추가"
            >
              <label className="border-bingo-menu-divider body1 flex h-11 cursor-pointer items-center justify-between border-b px-4">
                사진 선택
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <label className="body1 flex h-11 cursor-pointer items-center justify-between px-4">
                카메라로 촬영
                <Image
                  src="/icons/bingo/camera.png"
                  alt=""
                  width={22}
                  height={22}
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
