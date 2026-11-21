const INVITE_PATH_PATTERN = /\/invite\/([^/?#\s]+)/;
const PENDING_INVITE_CODE_KEY = "kankan:pending-invite-code";

/** 초대 링크(https://.../invite/CODE)나 코드 자체를 받아 초대 코드만 돌려준다. */
export const parseInviteCode = (input: string) => {
  const trimmed = input.trim();
  return trimmed.match(INVITE_PATH_PATTERN)?.[1] ?? trimmed;
};

// 초대 링크로 들어온 뒤 로그인을 거쳐도 코드를 잃지 않도록 같은 탭에 잠시 보관한다.
export const savePendingInviteCode = (code: string) => {
  try {
    sessionStorage.setItem(PENDING_INVITE_CODE_KEY, code);
  } catch {
    // 저장소를 쓸 수 없으면 자동 입력만 건너뛴다.
  }
};

export const takePendingInviteCode = (): string | null => {
  try {
    const code = sessionStorage.getItem(PENDING_INVITE_CODE_KEY);
    sessionStorage.removeItem(PENDING_INVITE_CODE_KEY);
    return code;
  } catch {
    return null;
  }
};
