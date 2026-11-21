export const ROOM_NAME_MAX_LENGTH = 20;
export const ROOM_MIN_MEMBERS = 2;
export const ROOM_MAX_MEMBERS = 9;
export const ROOM_DEFAULT_MEMBERS = 2;

/** 화면의 목표 빙고 선택값을 API target_bingo 값으로 바꾼다. 올빙고는 8. */
export const TARGET_BINGO_API_VALUES = {
  1: 1,
  2: 2,
  3: 3,
  ALL: 8,
} as const;
