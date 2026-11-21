import { BingoScreen } from "@/components/bingo/BingoScreen";
import { homeRoomsResponse } from "@/mocks/homeRooms";
import { notFound } from "next/navigation";
import Link from "next/link";

const RoomDetailPage = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;
  const room = homeRoomsResponse.data.rooms.find(
    (item) => String(item.room_id) === roomId
  );
  if (!room) notFound();
  if (room.status !== "IN_PROGRESS") {
    return (
      <main className="bg-bg-normal flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="body2 text-text-title">
          {room.status === "RECRUITING"
            ? "활동 선택이 끝나면 빙고판이 준비돼요."
            : "빙고 결과 화면은 준비 중이에요."}
        </p>
        <Link href="/" className="body4 text-primary-normal">
          홈으로 돌아가기
        </Link>
      </main>
    );
  }
  return <BingoScreen room={room} />;
};

export default RoomDetailPage;
