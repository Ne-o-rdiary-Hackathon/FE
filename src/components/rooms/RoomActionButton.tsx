import { useState } from "react";
import { useRouter } from "next/navigation";

import { IcClose, IcPlus } from "@/components/icons";

const ROOM_ACTIONS = [
  { label: "방 생성하기", value: "create", href: "/create" },
  { label: "방 참여하기", value: "join", href: null },
] as const;

interface RoomActionButtonProps {
  onJoinClick: () => void;
}

export const RoomActionButton = ({ onJoinClick }: RoomActionButtonProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  const handleSelectAction = (href: string | null) => {
    handleClose();
    if (href) router.push(href);
    else onJoinClick();
  };

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={handleClose}
          className="bg-text-primary/40 fixed inset-0 z-10"
        />
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-7 z-20 mx-auto flex w-full max-w-md flex-col items-end gap-4 px-5">
        {isOpen && (
          <div className="rounded-16 bg-bg-normal pointer-events-auto flex w-40 flex-col px-5 py-2 shadow-sm">
            {ROOM_ACTIONS.map((action, index) => (
              <button
                key={action.value}
                type="button"
                onClick={() => handleSelectAction(action.href)}
                className={`body2 text-text-primary py-3 text-left ${
                  index > 0 ? "border-border-1 border-t" : ""
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          aria-label="방 추가 메뉴"
          aria-expanded={isOpen}
          onClick={handleToggle}
          className="bg-primary-normal text-text-white pointer-events-auto flex size-15 items-center justify-center rounded-full shadow-sm transition-transform active:scale-95"
        >
          {isOpen ? <IcClose size={32} /> : <IcPlus size={32} />}
        </button>
      </div>
    </>
  );
};
