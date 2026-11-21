import Link from "next/link";

import { IcArrowRight } from "@/components/icons";
import type { HomeRoom } from "@/types/room";

const statusLabels = {
  IN_PROGRESS: "진행 중",
  RECRUITING: "활동 선택 중",
  COMPLETED: "3줄 빙고 완료",
} as const;

interface RoomCardProps {
  room: HomeRoom;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const isInProgress = room.status === "IN_PROGRESS";
  const isCompleted = room.status === "COMPLETED";
  const progressPercent =
    room.total_cells > 0
      ? Math.round((room.completed_cells / room.total_cells) * 100)
      : 0;
  const actionLabel = isInProgress
    ? "입장하기"
    : isCompleted
      ? "보러가기"
      : null;

  return (
    <Link href={`/rooms/${room.room_id}`} className="block cursor-pointer">
      <article
        className={`rounded-16 bg-bg-normal border px-4.5 py-4.5 ${
          isInProgress ? "border-primary-normal/50" : "border-border-1"
        }`}
      >
        <span
          className={`body5 rounded-8 inline-flex min-h-6.25 items-center px-2.5 ${
            isInProgress
              ? "bg-primary-light text-primary-normal"
              : isCompleted
                ? "bg-gray-1 text-text-secondary-2"
                : "border-primary-normal text-primary-normal border"
          }`}
        >
          {isCompleted
            ? `${room.target_bingo}줄 빙고 완료`
            : statusLabels[room.status]}
        </span>

        <h2 className="h3 text-text-title mt-3.5">{room.room_name}</h2>

        {isInProgress && (
          <progress
            aria-label={`빙고칸 ${progressPercent}% 달성`}
            className="[&::-moz-progress-bar]:bg-primary-normal [&::-webkit-progress-bar]:bg-gray-1 [&::-webkit-progress-value]:bg-primary-normal mt-3.5 h-2 w-full appearance-none overflow-hidden rounded-full [&::-webkit-progress-value]:rounded-full"
            max={100}
            value={progressPercent}
          />
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <p className="body5 min-w-0">
            <span
              className={
                isCompleted ? "text-text-secondary-2" : "text-primary-normal"
              }
            >
              {room.achieved_bingo}/{room.target_bingo} 빙고 달성
            </span>
            <span className="text-text-secondary-2">
              {" "}
              · 참여 인원 {room.current_members}/{room.max_members}명
            </span>
          </p>

          {actionLabel && (
            <span className="body4 text-text-title inline-flex shrink-0 items-center gap-1">
              {actionLabel}
              <IcArrowRight size={16} />
            </span>
          )}
        </div>
      </article>
    </Link>
  );
};
