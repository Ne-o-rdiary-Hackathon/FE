import { afterEach, describe, expect, it } from "vitest";
import { useCreateRoomStore } from "./createRoom";

const DRAFT = { room_name: "테스트 방", max_members: 4, target_bingo: 3 };
const ROOM = {
  room_id: 1,
  room_name: "테스트 방",
  max_members: 4,
  current_members: 1,
  target_bingo: 3,
  status: "RECRUITING" as const,
  invite_url: "https://example.com/invite/ABC",
};

describe("방 생성 흐름 상태", () => {
  afterEach(() => useCreateRoomStore.getState().reset());

  it("새 입력값을 저장하면 이전에 만든 방 정보를 지운다", () => {
    useCreateRoomStore.getState().setCreatedRoom(ROOM);
    useCreateRoomStore.getState().setDraft(DRAFT);

    expect(useCreateRoomStore.getState().draft).toEqual(DRAFT);
    expect(useCreateRoomStore.getState().createdRoom).toBeNull();
  });

  it("reset은 입력값과 만든 방 정보를 모두 지운다", () => {
    useCreateRoomStore.getState().setDraft(DRAFT);
    useCreateRoomStore.getState().setCreatedRoom(ROOM);
    useCreateRoomStore.getState().reset();

    expect(useCreateRoomStore.getState().draft).toBeNull();
    expect(useCreateRoomStore.getState().createdRoom).toBeNull();
  });
});
