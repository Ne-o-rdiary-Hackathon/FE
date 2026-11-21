export type RoomStatus = "IN_PROGRESS" | "RECRUITING" | "COMPLETED";

export interface HomeRoom {
  room_id: number;
  room_name: string;
  status: RoomStatus;
  current_members: number;
  max_members: number;
  target_bingo: number;
  achieved_bingo: number;
  completed_cells: number;
  total_cells: number;
  invite_url: string;
}

export interface HomeRoomList {
  total_count: number;
  page: number;
  size: number;
  rooms: HomeRoom[];
}

export type RoomFilter = "ALL" | RoomStatus;

export type HomeRoomListParams = {
  status: RoomFilter;
  page: number;
  size: number;
};

export type TargetBingo = 1 | 2 | 3 | "ALL";

export type RoomCreateRequest = {
  room_name: string;
  max_members: number;
  target_bingo: number;
};

export type RoomCreateResponse = {
  room_id: number;
  room_name: string;
  max_members: number;
  current_members: number;
  target_bingo: number;
  status: RoomStatus;
  invite_url: string;
};
