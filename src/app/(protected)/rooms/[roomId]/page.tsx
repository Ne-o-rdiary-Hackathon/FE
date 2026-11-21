import { BingoRoom } from "@/components/bingo/BingoRoom";
import { notFound } from "next/navigation";

const RoomDetailPage = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;
  const id = Number(roomId);
  if (!/^\d+$/.test(roomId) || !Number.isSafeInteger(id) || id <= 0) notFound();
  return <BingoRoom roomId={id} />;
};

export default RoomDetailPage;
