"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { MOCK_BINGO } from "@/mocks/bingo";
import { getCompletedLines } from "@/lib/bingo/lines";
import { PhotoEditor } from "./PhotoEditor";

export const BingoScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ file: File; cellIndex: number } | null>(
    null
  );
  const [photos, setPhotos] = useState<Record<number, string>>({});
  const photoUrls = useRef<string[]>([]);
  const selectedCellRef = useRef<HTMLDivElement>(null);
  useEffect(
    () => () => photoUrls.current.forEach((url) => URL.revokeObjectURL(url)),
    []
  );
  const completedLines = getCompletedLines(
    new Set(Object.keys(photos).map(Number))
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
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !selectedCellRef.current?.contains(event.target)
      ) {
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 gap-x-2 gap-y-3"
          >
            {completedLines.map((line) => {
              const horizontal = line[1] - line[0] === 1;
              const vertical = line[1] - line[0] === 3;
              const position = horizontal
                ? [
                    "col-span-3 row-start-1",
                    "col-span-3 row-start-2",
                    "col-span-3 row-start-3",
                  ][Math.floor(line[0] / 3)]
                : vertical
                  ? [
                      "row-span-3 col-start-1",
                      "row-span-3 col-start-2",
                      "row-span-3 col-start-3",
                    ][line[0]]
                  : "col-span-3 row-span-3";
              return (
                <div key={line.join("-")} className={`relative ${position}`}>
                  <div
                    className={`bingo-line ${!horizontal && !vertical ? (line[0] === 0 ? "bingo-line-diagonal" : "bingo-line-diagonal-reverse") : "absolute -inset-2"}`}
                  />
                </div>
              );
            })}
          </div>
          {MOCK_BINGO.activities.map((activity, index) => (
            <div
              key={activity.join(" ")}
              ref={selectedIndex === index ? selectedCellRef : null}
              className={`relative min-w-0 ${selectedIndex === index ? "z-20" : ""}`}
            >
              <button
                type="button"
                disabled={Boolean(photos[index])}
                aria-pressed={selectedIndex === index}
                onClick={() =>
                  setSelectedIndex(selectedIndex === index ? null : index)
                }
                className={`bg-bingo-cell text-primary-darker @container relative flex aspect-[116/112] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl text-center ${selectedIndex === index ? "ring-primary-normal ring-1 ring-inset" : ""}`}
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
                    <span className="bingo-photo-shade absolute inset-0" />
                  </>
                )}
                {completedLines.some((line) =>
                  line.some((cell) => cell === index)
                ) && (
                  <span className="text-primary-normal absolute top-[min(0.625rem,8.62cqw)] z-10 rounded-[min(0.25rem,3.45cqw)] bg-white/90 px-[min(0.375rem,5.17cqw)] py-[min(0.125rem,1.72cqw)] text-[min(0.625rem,8.62cqw)] leading-[1.4] font-semibold tracking-[-0.025em]">
                    BINGO!
                  </span>
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
                  className={`relative ${photos[index] && completedLines.some((line) => line.some((cell) => cell === index)) ? "" : "translate-y-[min(0.5rem,6.9cqw)]"} ${photos[index] ? "text-white" : index === 4 ? "text-primary-normal" : ""}`}
                >
                  <p
                    className={`${photos[index] && completedLines.some((line) => line.some((cell) => cell === index)) ? "text-[min(0.8125rem,11.21cqw)]" : "text-[min(0.875rem,12.07cqw)]"} leading-[1.4] font-semibold tracking-[-0.025em]`}
                  >
                    {activity[0]}
                    <br />
                    {activity[1]}
                  </p>
                  {!completedLines.some((line) =>
                    line.some((cell) => cell === index)
                  ) && (
                    <p className="mt-[min(0.5rem,6.9cqw)] text-[min(0.6875rem,9.48cqw)] leading-[1.4] tracking-[-0.025em]">
                      {photos[index] ? "인증완료" : "미완료"}
                    </p>
                  )}
                </div>
                {photos[index] &&
                  completedLines.some((line) =>
                    line.some((cell) => cell === index)
                  ) && (
                    <p className="absolute bottom-[min(0.625rem,8.62cqw)] text-[min(0.6875rem,9.48cqw)] leading-[1.4] tracking-[-0.025em] text-white">
                      인증완료
                    </p>
                  )}
              </button>
              {selectedIndex === index && (
                <div
                  className={`bg-bingo-menu absolute z-10 w-55 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl backdrop-blur-sm ${index >= 6 ? "bottom-full mb-1" : "top-full mt-1"} ${index % 3 === 0 ? "left-0" : index % 3 === 2 ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                  aria-label="사진 추가"
                >
                  <label className="border-bingo-menu-divider body1 flex h-11 cursor-pointer items-center justify-between border-b px-4">
                    사진 선택
                    <Image
                      src="/icons/bingo/select-photo.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
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
          ))}
        </div>
      </section>
    </main>
  );
};
