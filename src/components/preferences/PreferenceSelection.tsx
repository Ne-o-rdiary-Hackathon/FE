"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { BottomButton } from "@/components/common/BottomButton";
import { Chip } from "@/components/common/Chip";
import { useActivitiesQuery } from "@/hooks/activities/useActivitiesQuery";
import { useSubmitActivitiesMutation } from "@/hooks/activities/useSubmitActivitiesMutation";
import { getSubmissionErrorMessage } from "@/lib/preferences/errors";
import { toggleActivity, toggleGroup } from "@/lib/preferences/selection";
import { cn } from "@/lib/utils";

export const PreferenceSelection = ({ roomId }: { roomId: number | null }) => {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useActivitiesQuery();
  const submission = useSubmitActivitiesMutation();
  const router = useRouter();
  const [step, setStep] = useState<"desired" | "bored">("bored");
  const [categoryIndexes, setCategoryIndexes] = useState({
    desired: 0,
    bored: 0,
  });
  const [expanded, setExpanded] = useState({
    desired: [] as string[],
    bored: [] as string[],
  });
  const [selections, setSelections] = useState({
    desired: [] as number[],
    bored: [] as number[],
  });
  const categoryIndex = categoryIndexes[step];
  const category = categories[categoryIndex];
  const selected = selections[step];
  const isDesired = step === "desired";

  useEffect(() => {
    const handleHistoryChange = () => {
      setStep(window.location.hash === "#desired" ? "desired" : "bored");
    };

    handleHistoryChange();
    window.addEventListener("popstate", handleHistoryChange);
    return () => window.removeEventListener("popstate", handleHistoryChange);
  }, []);

  const handleBack = () => {
    if (isDesired) {
      if (window.history.state?.preferenceStep === "desired") {
        window.history.back();
      } else {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
        setStep("bored");
      }
      return;
    }
    if (window.history.length > 1) router.back();
    else router.push("/home");
  };
  const handleCategory = (index: number) => {
    setCategoryIndexes((previous) => ({ ...previous, [step]: index }));
  };
  const handleNext = async () => {
    if (!isDesired) {
      window.history.pushState({ preferenceStep: "desired" }, "", "#desired");
      setStep("desired");
      window.scrollTo(0, 0);
    } else {
      if (!roomId || submission.isPending) return;
      try {
        await submission.mutateAsync({
          roomId,
          body: {
            desired_activity_ids: selections.desired,
            bored_activity_ids: selections.bored,
          },
        });
      } catch {
        // Preserve selections for retry.
      }
    }
  };

  if (submission.isSuccess) {
    return (
      <main className="bg-bg-normal text-text-primary flex min-h-dvh flex-col justify-center gap-6 px-5">
        <p>활동 선택을 제출했습니다.</p>
        <BottomButton onClick={() => router.push("/home")}>홈으로</BottomButton>
      </main>
    );
  }

  return (
    <main className="bg-bg-normal text-text-primary flex min-h-dvh flex-col">
      <header className="bg-bg-normal sticky top-0 z-20 pt-4">
        <div className="flex h-11 items-center gap-1">
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로 가기"
            className="focus-visible:outline-primary-normal flex h-11 w-9.5 shrink-0 items-center justify-center focus-visible:outline-2"
          >
            <Image
              src="/icons/preferences/back.svg"
              width={38}
              height={44}
              alt=""
              className="max-w-none shrink-0"
            />
          </button>
          <h1 className="h3 flex items-center gap-1 font-bold">
            {isDesired ? (
              <Image
                src="/icons/preferences/desired-activity.svg"
                width={20}
                height={20}
                alt=""
              />
            ) : (
              <Image
                src="/icons/preferences/bored-activity-title.svg"
                width={133}
                height={21}
                alt="하기 싫은 활동"
              />
            )}
            {isDesired && "하고 싶은 활동"}{" "}
            <span className="text-primary-normal">
              {isDesired ? "2/2" : "1/2"}
            </span>
          </h1>
        </div>
        <p className="body5 text-text-secondary-2 pr-4 pl-9.5">
          {isDesired
            ? "친구들과 새롭게 하고 싶은 활동을 모두 골라주세요. (중복 선택)"
            : "평소 지루하게 느껴지는 활동을 자유롭게 골라주세요. (다중 선택)"}
        </p>
        <nav
          aria-label="활동 카테고리"
          className="border-border-1 mt-2 flex [scrollbar-width:none] overflow-x-auto border-b px-5"
        >
          {categories.map((item, index) => (
            <button
              key={item.category_id}
              type="button"
              aria-current={categoryIndex === index ? "true" : undefined}
              onClick={() => handleCategory(index)}
              className={cn(
                "body2 font-semibold min-w-17 shrink-0 border-b-2 px-2 py-2.5 whitespace-nowrap",
                categoryIndex === index
                  ? "border-primary-normal text-primary-normal"
                  : "border-transparent text-text-primary"
              )}
            >
              {item.category_name}
            </button>
          ))}
        </nav>
      </header>
      <div className="flex-1 px-6.5 pt-1 pb-28">
        {isLoading && <output>활동 목록을 불러오는 중입니다.</output>}
        {isError && (
          <div role="alert">
            <p>활동 목록을 불러오지 못했습니다.</p>
            <button type="button" onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        )}
        {!isLoading && !isError && categories.length === 0 && (
          <p>등록된 활동이 없습니다.</p>
        )}
        {category?.subcategories.map((group) => {
          const groupKey = `${category.category_id}:${group.category_id}`;
          const isExpanded = expanded[step].includes(groupKey);
          const isAllSelected =
            group.activities.length > 0 &&
            group.activities.every((activity) =>
              selected.includes(activity.activity_id)
            );
          return (
            <section
              key={group.category_id}
              className="border-border-1 border-b"
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() =>
                  setExpanded((previous) => ({
                    ...previous,
                    [step]: toggleActivity(previous[step], groupKey),
                  }))
                }
                className="focus-visible:outline-primary-normal flex min-h-18.5 w-full items-center justify-between text-left focus-visible:outline-2"
              >
                <span className="text-lg leading-[1.4] font-semibold tracking-tight">
                  {group.category_name}
                </span>
                <Image
                  src="/icons/preferences/expand.svg"
                  width={24}
                  height={24}
                  alt=""
                  className={cn(
                    "text-text-disable transition-transform duration-200 ease-out motion-reduce:transition-none",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>
              <div
                inert={!isExpanded}
                className={cn(
                  "relative grid transition-[grid-template-rows,opacity,margin-top] duration-200 ease-out motion-reduce:transition-none",
                  isExpanded
                    ? "-mt-3 grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="pt-1 pb-4">
                    <div className="flex flex-wrap gap-x-1 gap-y-2">
                      {group.activities.map((activity) => {
                        const isSelected = selected.includes(
                          activity.activity_id
                        );
                        return (
                          <Chip
                            key={activity.activity_id}
                            isSelected={isSelected}
                            onClick={() =>
                              setSelections((previous) => ({
                                ...previous,
                                [step]: toggleActivity(
                                  previous[step],
                                  activity.activity_id
                                ),
                              }))
                            }
                            className={cn(
                              "min-h-9.5 touch-manipulation rounded-pill px-4 focus-visible:outline-2 focus-visible:outline-primary-normal",
                              isSelected
                                ? "body2 font-medium border-primary-light"
                                : "body2 border-border-2 text-text-secondary-2"
                            )}
                          >
                            {activity.activity_name}
                          </Chip>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      aria-pressed={isAllSelected}
                      onClick={() =>
                        setSelections((previous) => ({
                          ...previous,
                          [step]: toggleGroup(
                            previous[step],
                            group.activities.map(
                              (activity) => activity.activity_id
                            )
                          ),
                        }))
                      }
                      className={cn(
                        "body3 font-medium mt-4 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-primary-normal",
                        isAllSelected
                          ? "text-primary-normal"
                          : "text-text-secondary-2"
                      )}
                    >
                      <Image
                        src={
                          isAllSelected
                            ? "/icons/preferences/check-selected.svg"
                            : "/icons/preferences/check.svg"
                        }
                        width={20}
                        height={20}
                        alt=""
                      />
                      모든 활동 선택하기
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <div className="border-border-1 bg-bg-normal sticky bottom-0 border-t px-5 pt-4 pb-6">
        {submission.isError && (
          <p role="alert">{getSubmissionErrorMessage(submission.error)}</p>
        )}
        <BottomButton
          onClick={handleNext}
          disabled={
            isLoading ||
            isError ||
            categories.length === 0 ||
            submission.isPending ||
            (isDesired && !roomId)
          }
        >
          {submission.isPending
            ? "제출 중..."
            : !isDesired
              ? `다음 (총 ${selected.length}개 항목 반영)`
              : `선택 완료 (총 ${selected.length}개 항목 반영)`}
        </BottomButton>
      </div>
    </main>
  );
};
