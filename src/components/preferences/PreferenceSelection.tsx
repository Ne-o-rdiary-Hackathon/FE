"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ACTIVITY_CATEGORIES } from "@/constants/activities";
import { toggleActivity, toggleGroup } from "@/lib/preferences/selection";
import { cn } from "@/lib/utils";

export const PreferenceSelection = () => {
  const router = useRouter();
  const [step, setStep] = useState<"desired" | "bored">("desired");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [expanded, setExpanded] = useState({
    desired: [] as string[],
    bored: [] as string[],
  });
  const [selections, setSelections] = useState({
    desired: [] as string[],
    bored: [] as string[],
  });
  const category = ACTIVITY_CATEGORIES[categoryIndex];
  const selected = selections[step];
  const isDesired = step === "desired";

  useEffect(() => {
    const handleHistoryChange = () => {
      setStep(window.location.hash === "#bored" ? "bored" : "desired");
    };

    handleHistoryChange();
    window.addEventListener("popstate", handleHistoryChange);
    return () => window.removeEventListener("popstate", handleHistoryChange);
  }, []);

  const handleBack = () => {
    if (!isDesired) {
      if (window.history.state?.preferenceStep === "bored") {
        window.history.back();
      } else {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
        setStep("desired");
      }
      return;
    }
    if (window.history.length > 1) router.back();
    else router.push("/");
  };
  const handleCategory = (index: number) => {
    setCategoryIndex(index);
  };
  const handleNext = () => {
    if (isDesired) {
      window.history.pushState({ preferenceStep: "bored" }, "", "#bored");
      setStep("bored");
      setCategoryIndex(0);
      window.scrollTo(0, 0);
    } else {
      router.push("/invitation");
    }
  };

  return (
    <main className="bg-bg-normal text-text-primary flex min-h-dvh flex-col">
      <header className="pt-4">
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
              <span aria-hidden="true">🙅‍♂️</span>
            )}
            {isDesired ? "하고 싶은 활동" : "하기 싫은 활동"}{" "}
            <span className="text-primary-normal">
              {isDesired ? "1/2" : "2/2"}
            </span>
          </h1>
        </div>
        <p className="body5 text-text-secondary-2 pr-4 pl-9.5">
          {isDesired
            ? "친구들과 새롭게 하고 싶은 활동을 모두 골라주세요. (중복 선택)"
            : "평소 지루하게 느껴지는 활동을 자유롭게 골라주세요."}
        </p>
        <nav
          aria-label="활동 카테고리"
          className="border-border-1 mt-2 flex [scrollbar-width:none] overflow-x-auto border-b px-5"
        >
          {ACTIVITY_CATEGORIES.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-current={categoryIndex === index ? "true" : undefined}
              onClick={() => handleCategory(index)}
              className={cn(
                "body2 min-w-17 shrink-0 border-b-2 px-2 py-2.5 font-semibold whitespace-nowrap",
                categoryIndex === index
                  ? "border-primary-normal text-primary-normal"
                  : "border-transparent text-text-primary"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <div className="flex-1 px-6.5 pt-1 pb-28">
        {category.groups.map((group) => {
          const groupKey = `${category.name}:${group.name}`;
          const isExpanded = expanded[step].includes(groupKey);
          const isAllSelected = group.activities.every((id) =>
            selected.includes(id)
          );
          return (
            <section key={group.name} className="border-border-1 border-b">
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
                  {group.name}
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
                        const isSelected = selected.includes(activity);
                        return (
                          <button
                            key={activity}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() =>
                              setSelections((previous) => ({
                                ...previous,
                                [step]: toggleActivity(
                                  previous[step],
                                  activity
                                ),
                              }))
                            }
                            className={cn(
                              "body2 min-h-9.5 touch-manipulation rounded-pill border px-4 font-medium focus-visible:outline-2 focus-visible:outline-primary-normal",
                              isSelected
                                ? "border-primary-light bg-primary-light font-medium text-primary-normal"
                                : "border-border-2 bg-bg-normal text-text-secondary-2"
                            )}
                          >
                            {activity}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      aria-pressed={isAllSelected}
                      onClick={() =>
                        setSelections((previous) => ({
                          ...previous,
                          [step]: toggleGroup(previous[step], group.activities),
                        }))
                      }
                      className={cn(
                        "body3 mt-4 flex items-center gap-2 font-medium focus-visible:outline-2 focus-visible:outline-primary-normal",
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
        <button
          type="button"
          onClick={handleNext}
          className="body3 rounded-8 bg-primary-normal focus-visible:outline-primary-normal min-h-13 w-full px-4 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
        >
          {isDesired
            ? `다음 (총 ${selected.length}개 항목 반영)`
            : `선택 완료 (총 ${selected.length}개 항목 반영)`}
        </button>
      </div>
    </main>
  );
};
