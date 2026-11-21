import { IcKakao } from "@/components/icons";

interface KakaoLoginButtonProps {
  onClick: () => void;
}

export const KakaoLoginButton = ({ onClick }: KakaoLoginButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-kakao text-text-primary flex h-14 w-full items-center justify-center gap-2 rounded-xl"
  >
    <IcKakao size={20} />
    <span className="body2 font-bold">카카오로 시작하기</span>
  </button>
);
