import { create } from "zustand";

import type { RoomCreateRequest, RoomCreateResponse } from "@/types/room";

interface CreateRoomState {
  draft: RoomCreateRequest | null;
  createdRoom: RoomCreateResponse | null;
  setDraft: (draft: RoomCreateRequest) => void;
  setCreatedRoom: (room: RoomCreateResponse) => void;
  reset: () => void;
}

// 방 만들기 → 취향 선택 → 초대장 화면까지 입력값과 생성된 방을 넘겨준다.
export const useCreateRoomStore = create<CreateRoomState>((set) => ({
  draft: null,
  createdRoom: null,
  setDraft: (draft) => set({ draft, createdRoom: null }),
  setCreatedRoom: (createdRoom) => set({ createdRoom }),
  reset: () => set({ draft: null, createdRoom: null }),
}));
