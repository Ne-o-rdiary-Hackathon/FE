import { useEffect, useRef, useState } from "react";

import { IcCheck } from "@/components/icons";
import { Toast } from "@/components/ui/toast";

interface RoomInviteLinkProps {
  inviteUrl: string;
}

interface ToastState {
  message: string;
  icon?: React.ReactNode;
}

const TOAST_DURATION_MS = 2000;
const COPY_SUCCESS_MESSAGE = "링크가 복사 됐습니다.";
const COPY_FAILURE_MESSAGE = "복사에 실패했어요";

export const RoomInviteLink = ({ inviteUrl }: RoomInviteLinkProps) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearToastTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const showToast = (nextToast: ToastState) => {
    clearToastTimer();
    setToast(nextToast);
    timerRef.current = window.setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, TOAST_DURATION_MS);
  };

  useEffect(() => clearToastTimer, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      showToast({
        message: COPY_SUCCESS_MESSAGE,
        icon: (
          <span className="bg-primary-normal text-text-white flex size-6 items-center justify-center rounded-full">
            <IcCheck size={16} />
          </span>
        ),
      });
    } catch {
      showToast({ message: COPY_FAILURE_MESSAGE });
    }
  };

  return (
    <div className="border-border-1 bg-bg-gray rounded-8 mt-4 flex items-center justify-between gap-3 border px-4 py-3">
      <p className="body4 text-text-secondary-1 min-w-0 truncate">
        {inviteUrl}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="body4 text-primary-normal shrink-0 font-semibold"
      >
        복사
      </button>

      {toast && <Toast message={toast.message} icon={toast.icon} />}
    </div>
  );
};
