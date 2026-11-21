import { Chip } from "@/components/common/Chip";
import { cn } from "@/lib/utils";
import type { TargetBingo } from "@/types/room";

const GOAL_OPTIONS: { value: TargetBingo; label: string }[] = [
  { value: 1, label: "1줄 빙고" },
  { value: 2, label: "2줄 빙고" },
  { value: 3, label: "3줄 빙고" },
  { value: "ALL", label: "올빙고" },
];

interface CreateRoomGoalFieldProps {
  value: TargetBingo;
  onChange: (value: TargetBingo) => void;
}

export const CreateRoomGoalField = ({
  value,
  onChange,
}: CreateRoomGoalFieldProps) => (
  <section className="flex flex-col gap-2">
    <h2 className="body4 text-text-title font-bold">목표 빙고 수</h2>

    <div className="flex gap-2">
      {GOAL_OPTIONS.map((option) => {
        const isSelected = option.value === value;
        return (
          <Chip
            key={option.label}
            isSelected={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-pill min-w-0 flex-1 px-3.5 py-2",
              isSelected
                ? "body5 font-bold"
                : "body5 font-medium text-text-title"
            )}
          >
            {option.label}
          </Chip>
        );
      })}
    </div>
  </section>
);
