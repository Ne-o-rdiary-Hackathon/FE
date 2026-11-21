"use client";

import { useRouter } from "next/navigation";

import { IcArrowRight } from "@/components/icons";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();

  const handleBack = () => router.back();

  return (
    <header className="border-border-1 relative flex h-13 shrink-0 items-center justify-center border-b px-5">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={handleBack}
        className="rounded-8 absolute left-5 flex size-8 items-center justify-center"
      >
        <IcArrowRight size={24} className="rotate-180" />
      </button>
      <h1 className="body1 text-text-title font-bold">{title}</h1>
    </header>
  );
};
