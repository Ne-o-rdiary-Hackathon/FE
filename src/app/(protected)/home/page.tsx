"use client";

import { useMemo, useState } from "react";

import { RoomActionButton } from "@/components/rooms/RoomActionButton";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomStatusFilters } from "@/components/rooms/RoomStatusFilters";
import { RoomsHeader } from "@/components/rooms/RoomsHeader";
import { useMeQuery } from "@/hooks/auth/useMeQuery";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { homeRoomsResponse } from "@/mocks/homeRooms";
import type { RoomFilter } from "@/types/room";

const { rooms, total_count: totalCount } = homeRoomsResponse.data;

const ROOMS_PAGE_SIZE = 4;

const RoomsPage = () => {
  const { data: me } = useMeQuery();
  const [activeFilter, setActiveFilter] = useState<RoomFilter>("ALL");
  const [visibleCount, setVisibleCount] = useState(ROOMS_PAGE_SIZE);

  const filteredRooms = useMemo(
    () =>
      activeFilter === "ALL"
        ? rooms
        : rooms.filter((room) => room.status === activeFilter),
    [activeFilter]
  );

  const visibleRooms = filteredRooms.slice(0, visibleCount);
  const hasMoreRooms = visibleCount < filteredRooms.length;

  const handleFilterChange = (filter: RoomFilter) => {
    setActiveFilter(filter);
    setVisibleCount(ROOMS_PAGE_SIZE);
  };

  const handleLoadMore = () => {
    if (hasMoreRooms) setVisibleCount((prev) => prev + ROOMS_PAGE_SIZE);
  };

  const sentinelRef = useInfiniteScroll({
    hasMore: hasMoreRooms,
    onLoadMore: handleLoadMore,
  });

  return (
    <main className="bg-bg-normal flex h-dvh flex-col overflow-hidden px-5">
      <RoomsHeader nickname={me?.nickname ?? ""} />

      <section
        aria-labelledby="rooms-heading"
        className="mt-10 flex min-h-0 flex-1 flex-col"
      >
        <h1 id="rooms-heading" className="h3 text-text-title mb-5">
          내가 참여한 방{" "}
          <span className="text-primary-normal">{totalCount}</span>
        </h1>

        <RoomStatusFilters
          activeFilter={activeFilter}
          onChange={handleFilterChange}
        />

        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-28">
          {visibleRooms.map((room) => (
            <RoomCard key={room.room_id} room={room} />
          ))}

          {hasMoreRooms && (
            <div ref={sentinelRef} aria-hidden="true" className="h-px" />
          )}
        </div>
      </section>

      <RoomActionButton />
    </main>
  );
};

export default RoomsPage;
