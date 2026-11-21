import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRoom } from "@/apis/rooms/rooms";
import { roomKeys } from "@/apis/rooms/keys";

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() }),
  });
};
