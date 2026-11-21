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
        <button
          key={filter.value}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(filter.value)}
          className={`body4 h-8.5 rounded-full px-4.5 transition-colors ${
            isActive
              ? "bg-primary-normal text-text-white"
              : "text-text-secondary-1 bg-bg-gray"
          }`}
        >
          {filter.label}
        </button>
      );
    })}
  </div>
);
