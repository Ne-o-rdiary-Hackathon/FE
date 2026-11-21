import { useQuery } from "@tanstack/react-query";

import { roomKeys } from "@/apis/rooms/keys";
import { fetchInviteRoom } from "@/apis/rooms/rooms";

export const useInviteRoomQuery = (inviteCode: string) =>
  useQuery({
    queryKey: roomKeys.invite(inviteCode),
    queryFn: () => fetchInviteRoom(inviteCode),
    enabled: inviteCode.length > 0,
    retry: false,
  });
