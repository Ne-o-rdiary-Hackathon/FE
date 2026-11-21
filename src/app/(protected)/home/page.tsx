"use client";

import { useMemo, useState } from "react";

import { RoomActionButton } from "@/components/rooms/RoomActionButton";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomStatusFilters } from "@/components/rooms/RoomStatusFilters";
import { RoomsHeader } from "@/components/rooms/RoomsHeader";
import { useMeQuery } from "@/hooks/auth/useMeQuery";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useRoomsQuery } from "@/hooks/rooms/useRoomsQuery";
import type { HomeRoomListParams, RoomFilter } from "@/types/room";

const ROOM_LIST_PARAMS: HomeRoomListParams = {
  status: "ALL",
  page: 1,
  size: 10,
};

const ROOMS_PAGE_SIZE = 4;

const RoomsPage = () => {
  const { data: me } = useMeQuery();
  const {
    data: roomList,
    isPending,
    isError,
  } = useRoomsQuery(ROOM_LIST_PARAMS);
  const rooms = useMemo(() => roomList?.rooms ?? [], [roomList]);
  const totalCount = roomList?.total_count ?? 0;
  const [activeFilter, setActiveFilter] = useState<RoomFilter>("ALL");
  const [visibleCount, setVisibleCount] = useState(ROOMS_PAGE_SIZE);

  const filteredRooms = useMemo(
    () =>
      activeFilter === "ALL"
        ? rooms
        : rooms.filter((room) => room.status === activeFilter),
    [activeFilter, rooms]
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
          {isPending && (
            <p className="body3 text-text-secondary-2">
              방 목록을 불러오고 있어요...
            </p>
          )}
          {isError && (
            <p className="body3 text-text-secondary-2">
              방 목록을 불러오지 못했어요.
            </p>
          )}
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
