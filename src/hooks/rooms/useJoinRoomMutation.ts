import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomKeys } from "@/apis/rooms/keys";
import { joinRoom } from "@/apis/rooms/rooms";

export const useJoinRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinRoom,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() }),
  });
};
