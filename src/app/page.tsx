"use client";

import { useMemo, useState } from "react";

import { RoomActionButton } from "@/components/rooms/RoomActionButton";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomStatusFilters } from "@/components/rooms/RoomStatusFilters";
import { RoomsHeader } from "@/components/rooms/RoomsHeader";
import { homeRoomsResponse } from "@/mocks/homeRooms";
import { currentUserMock } from "@/mocks/user";
import type { RoomFilter } from "@/types/room";

const { rooms, total_count: totalCount } = homeRoomsResponse;

const RoomsPage = () => {
  const [activeFilter, setActiveFilter] = useState<RoomFilter>("ALL");

  const filteredRooms = useMemo(
    () =>
      activeFilter === "ALL"
        ? rooms
        : rooms.filter((room) => room.status === activeFilter),
    [activeFilter]
  );

  return (
    <main className="bg-bg-normal relative min-h-dvh px-5 pb-28">
      <RoomsHeader nickname={currentUserMock.nickname} />

      <section aria-labelledby="rooms-heading" className="mt-10">
        <h1 id="rooms-heading" className="h3 text-text-title mb-5">
          내가 참여한 방{" "}
          <span className="text-primary-normal">{totalCount}</span>
        </h1>

        <RoomStatusFilters
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />

        <div className="mt-5 flex flex-col gap-5">
          {filteredRooms.map((room) => (
            <RoomCard key={room.room_id} room={room} />
          ))}
        </div>
      </section>

      <RoomActionButton />
    </main>
  );
};

export default RoomsPage;
