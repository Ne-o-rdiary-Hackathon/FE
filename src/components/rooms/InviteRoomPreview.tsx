import type { InviteRoomInfo, RoomStatus } from "@/types/room";

const STATUS_LABELS: Record<RoomStatus, string> = {
  IN_PROGRESS: "진행 중",
  RECRUITING: "활동 선택 중",
  COMPLETED: "빙고 완료",
};

interface InviteRoomPreviewProps {
  room: InviteRoomInfo;
}

export const InviteRoomPreview = ({ room }: InviteRoomPreviewProps) => (
  <div className="rounded-16 bg-bg-normal border-border-1 flex flex-col gap-3 border p-4.5">
    <span className="body5 rounded-8 border-primary-normal text-primary-normal inline-flex self-start border px-2.5 py-1 font-semibold">
      {STATUS_LABELS[room.status]}
    </span>
    <div className="flex flex-col gap-2">
      <p className="body1 text-text-title font-semibold break-words">
        {room.room_name}
      </p>
      <p className="body5">
        <span className="text-primary-normal font-semibold">
          {room.achieved_bingo}/{room.target_bingo} 빙고 달성
        </span>
        <span className="text-text-secondary-2">
          {" "}
          · 참여 인원 {room.current_members}/{room.max_members}명
        </span>
      </p>
    </div>
  </div>
);
