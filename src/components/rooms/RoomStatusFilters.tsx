import { Chip } from "@/components/common/Chip";
import type { RoomFilter } from "@/types/room";

const FILTERS: { value: RoomFilter; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "IN_PROGRESS", label: "진행 중" },
  { value: "RECRUITING", label: "선택 중" },
  { value: "COMPLETED", label: "완료" },
];

interface RoomStatusFiltersProps {
  activeFilter: RoomFilter;
  onChange: (filter: RoomFilter) => void;
}

export const RoomStatusFilters = ({
  activeFilter,
  onChange,
}: RoomStatusFiltersProps) => (
  <div aria-label="방 상태 필터" className="flex gap-1.5" role="tablist">
    {FILTERS.map((filter) => {
      const isActive = activeFilter === filter.value;

      return (
        <Chip
          key={filter.value}
          variant="filled"
          isSelected={isActive}
          onClick={() => onChange(filter.value)}
          className="body4 h-8.5 rounded-full px-4.5"
        >
          {filter.label}
        </Chip>
      );
    })}
  </div>
);
