import { ROOM_MAX_MEMBERS, ROOM_MIN_MEMBERS } from "@/constants/room";

interface CreateRoomHeadcountFieldProps {
  value: number;
  onChange: (value: number) => void;
}

const STEPPER_BUTTON_BASE_CLASS_NAME =
  "body2 font-bold rounded-8 flex size-8 items-center justify-center border bg-bg-normal";

const DECREASE_BUTTON_CLASS_NAME = `${STEPPER_BUTTON_BASE_CLASS_NAME} border-border-1 text-text-title disabled:text-text-disable`;

const INCREASE_BUTTON_CLASS_NAME = `${STEPPER_BUTTON_BASE_CLASS_NAME} border-primary-normal text-primary-normal disabled:border-border-1 disabled:text-text-disable`;

export const CreateRoomHeadcountField = ({
  value,
  onChange,
}: CreateRoomHeadcountFieldProps) => {
  const isMin = value <= ROOM_MIN_MEMBERS;
  const isMax = value >= ROOM_MAX_MEMBERS;

  const handleDecrease = () => {
    if (!isMin) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (!isMax) onChange(value + 1);
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="body4 text-text-title font-bold">
          모임 인원수 <span className="text-primary-normal">*</span>
        </h2>
        <span className="body5 text-text-secondary-1">
          최소 {ROOM_MIN_MEMBERS}명 ~ 최대 {ROOM_MAX_MEMBERS}명
        </span>
      </div>

      <div className="bg-bg-gray rounded-16 flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <p className="body3 text-text-title font-bold">총 {value}명 참여</p>
          <p className="body5 text-text-secondary-1">방장 포함 인원수입니다.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="인원수 줄이기"
            disabled={isMin}
            onClick={handleDecrease}
            className={DECREASE_BUTTON_CLASS_NAME}
          >
            -
          </button>
          <span className="body2 text-text-title w-5 text-center font-bold">
            {value}
          </span>
          <button
            type="button"
            aria-label="인원수 늘리기"
            disabled={isMax}
            onClick={handleIncrease}
            className={INCREASE_BUTTON_CLASS_NAME}
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
};
