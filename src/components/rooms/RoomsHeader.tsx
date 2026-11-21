import Image from "next/image";

interface RoomsHeaderProps {
  nickname: string;
}

export const RoomsHeader = ({ nickname }: RoomsHeaderProps) => (
  <header className="mt-3 flex h-8 items-center justify-between">
    <Image src="/logo.svg" alt="KANKAN" width={69} height={13} priority />
    <button
      type="button"
      aria-label="프로필 메뉴"
      className="body3 text-text-secondary-1"
    >
      {nickname}님
    </button>
  </header>
);
