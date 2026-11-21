import { Input } from "@/components/common/Input";
import { ROOM_NAME_MAX_LENGTH } from "@/constants/room";

interface CreateRoomNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const CreateRoomNameField = ({
  value,
  onChange,
}: CreateRoomNameFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value.slice(0, ROOM_NAME_MAX_LENGTH));

  return (
    <section className="flex flex-col gap-2">
      <label htmlFor="room-name" className="body4 text-text-title font-bold">
        모임명 <span className="text-primary-normal">*</span>
      </label>
      <Input
        id="room-name"
        value={value}
        onChange={handleChange}
        placeholder="모임 제목을 입력해주세요."
        trailing={
          <span className="body5 text-text-secondary-2 shrink-0">
            {value.length}/{ROOM_NAME_MAX_LENGTH}
          </span>
        }
      />
    </section>
  );
};
