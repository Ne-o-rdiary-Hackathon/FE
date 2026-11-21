import type { HomeRoomListParams } from "@/types/room";

export const roomKeys = {
  all: ["rooms"] as const,
  lists: () => [...roomKeys.all, "list"] as const,
  list: (params: HomeRoomListParams) => [...roomKeys.lists(), params] as const,
};
