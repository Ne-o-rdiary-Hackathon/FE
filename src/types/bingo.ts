import type { RoomStatus } from "@/types/room";

export interface BoardMember {
  user_id: number;
  nickname: string;
  profile_image_url: string | null;
  role: string;
}

export interface BingoCell {
  cell_id: number;
  position: number;
  activity_name: string;
  mission_text: string;
  score: number;
  status: string;
  image_url: string | null;
}

export interface BingoBoardResponse {
  room_name: string;
  members: BoardMember[];
  room_status: RoomStatus;
  target_bingo: number;
  achieved_bingo: number;
  completed_cells: number;
  bingo_cell_ids: number[];
  cells: BingoCell[];
}
