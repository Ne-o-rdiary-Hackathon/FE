"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState, type KeyboardEvent } from "react";

import { IcArrowRight } from "@/components/icons";
import { InviteRoomPreview } from "@/components/rooms/InviteRoomPreview";
import { useInviteRoomQuery } from "@/hooks/rooms/useInviteRoomQuery";
import { useJoinRoomMutation } from "@/hooks/rooms/useJoinRoomMutation";
import { HttpError } from "@/lib/api/http-error";
import { parseInviteCode } from "@/lib/invite/inviteCode";
import { cn } from "@/lib/utils";

const INVALID_CODE_MESSAGE = "초대코드가 존재하지 않습니다";
const CANNOT_JOIN_MESSAGE = "참여할 수 없는 방이에요";
const ALREADY_JOINED_MESSAGE = "이미 참여 중인 방이에요";
const JOIN_CONFLICT_MESSAGE = "이미 시작했거나 인원이 가득 찬 방이에요";
const JOIN_FAILED_MESSAGE = "방에 참여하지 못했어요. 다시 시도해 주세요.";

const getJoinErrorMessage = (error: unknown) =>
  error instanceof HttpError && error.status === 409
    ? JOIN_CONFLICT_MESSAGE
    : JOIN_FAILED_MESSAGE;

interface InviteCodeJoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCode?: string;
  joinedRoomIds: number[];
}

export const InviteCodeJoinDialog = ({
  open,
  onOpenChange,
  initialCode = "",
  joinedRoomIds,
}: InviteCodeJoinDialogProps) => {
  const router = useRouter();
  const [input, setInput] = useState(initialCode);
  const [checkedCode, setCheckedCode] = useState(parseInviteCode(initialCode));
  const inviteRoomQuery = useInviteRoomQuery(checkedCode);
  const joinRoomMutation = useJoinRoomMutation();

  useEffect(() => {
    setInput(initialCode);
    setCheckedCode(parseInviteCode(initialCode));
  }, [initialCode]);

  const code = parseInviteCode(input);
  const isChecked = code.length > 0 && code === checkedCode;
  const room =
    isChecked && inviteRoomQuery.data?.valid ? inviteRoomQuery.data.room : null;
  const isAlreadyJoined = room ? joinedRoomIds.includes(room.room_id) : false;
  const canJoin = (room?.can_join ?? false) && !isAlreadyJoined;
  const isPending = inviteRoomQuery.isFetching || joinRoomMutation.isPending;

  const errorMessage = (() => {
    if (!isChecked || inviteRoomQuery.isFetching) return null;
    if (inviteRoomQuery.isError || inviteRoomQuery.data?.valid === false)
      return INVALID_CODE_MESSAGE;
    if (isAlreadyJoined) return ALREADY_JOINED_MESSAGE;
    if (room && !room.can_join) return CANNOT_JOIN_MESSAGE;
    if (joinRoomMutation.isError)
      return getJoinErrorMessage(joinRoomMutation.error);
    return null;
  })();

  const handleChange = (value: string) => {
    setInput(value);
    joinRoomMutation.reset();
    // 초대 링크를 붙여넣으면 바로 방 정보를 확인한다.
    if (value.includes("/invite/")) setCheckedCode(parseInviteCode(value));
  };

  const handleSubmit = () => {
    if (!code || isPending) return;
    if (!isChecked) {
      setCheckedCode(code);
      return;
    }
    if (!canJoin) return;

    joinRoomMutation.mutate(code, {
      onSuccess: ({ room_id }) => {
        onOpenChange(false);
        router.push(`/preferences?roomId=${room_id}`);
      },
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSubmit();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="bg-text-primary/60 fixed inset-0 z-30 backdrop-blur-xs" />
        <Dialog.Viewport className="fixed inset-0 z-30 flex items-center justify-center px-5">
          <Dialog.Popup className="relative flex w-full max-w-md flex-col gap-3">
            {room && (
              <div className="absolute bottom-full left-0 mb-3 w-full">
                <InviteRoomPreview room={room} />
              </div>
            )}

            <div className="rounded-16 bg-bg-normal flex flex-col gap-0.5 px-6 py-5">
              <Dialog.Title className="body2 text-text-title font-medium">
                초대 코드로 참여하기
              </Dialog.Title>
              <Dialog.Description className="body4 text-text-secondary-2">
                친구에게 받은 초대코드를 아래에 입력해 주세요
              </Dialog.Description>
            </div>

            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "rounded-16 bg-bg-normal flex h-20 items-center gap-2 border-2 pr-4 pl-6",
                  errorMessage ? "border-red-error" : "border-transparent"
                )}
              >
                <input
                  value={input}
                  onChange={(event) => handleChange(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="초대 코드를 입력해 주세요"
                  aria-label="초대 코드"
                  aria-invalid={Boolean(errorMessage)}
                  className="body2 text-text-primary placeholder:text-text-disable min-w-0 flex-1 bg-transparent font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!code || isPending || (isChecked && !canJoin)}
                  aria-label={room ? "방 참여하기" : "초대 코드 확인하기"}
                  className="text-text-title disabled:text-text-disable flex size-10 shrink-0 items-center justify-center"
                >
                  <IcArrowRight size={24} />
                </button>
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="body5 text-red-error flex items-center gap-1.5"
                >
                  <span
                    aria-hidden="true"
                    className="bg-red-error text-text-white flex size-4 items-center justify-center rounded-full text-xs font-semibold"
                  >
                    !
                  </span>
                  {errorMessage}
                </p>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
