import { create } from "zustand";

type RoomPhotos = Record<number, string>;
export const EMPTY_ROOM_PHOTOS: Readonly<RoomPhotos> = {};

interface BingoState {
  photosByRoom: Record<number, RoomPhotos>;
  addPhoto: (roomId: number, cellIndex: number, blob: Blob) => void;
}

// API 연동 전 현재 브라우저 세션에서만 방별 사진을 유지합니다.
export const useBingoStore = create<BingoState>((set) => ({
  photosByRoom: {},
  addPhoto: (roomId, cellIndex, blob) =>
    set((state) => {
      const roomPhotos = state.photosByRoom[roomId] ?? {};
      if (roomPhotos[cellIndex]) return state;
      const photoUrl = URL.createObjectURL(blob);
      return {
        photosByRoom: {
          ...state.photosByRoom,
          [roomId]: { ...roomPhotos, [cellIndex]: photoUrl },
        },
      };
    }),
}));
