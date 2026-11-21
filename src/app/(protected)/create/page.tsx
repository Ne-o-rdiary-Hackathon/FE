"use client";

import { useState } from "react";

import { BottomButton } from "@/components/common/BottomButton";
import { Header } from "@/components/common/Header";
import { CreateRoomGoalField } from "@/components/rooms/CreateRoomGoalField";
import { CreateRoomHeadcountField } from "@/components/rooms/CreateRoomHeadcountField";
import { CreateRoomNameField } from "@/components/rooms/CreateRoomNameField";
import { ROOM_DEFAULT_MEMBERS } from "@/constants/room";
import type { TargetBingo } from "@/types/room";

const CreateRoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const [memberCount, setMemberCount] = useState(ROOM_DEFAULT_MEMBERS);
  const [targetBingo, setTargetBingo] = useState<TargetBingo>(1);

  const isSubmittable = roomName.trim().length > 0;

  return (
    <main className="bg-bg-normal flex h-dvh flex-col">
      <Header title="새 빙고 방 만들기" />

      <div className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto p-5">
        <CreateRoomNameField value={roomName} onChange={setRoomName} />
        <CreateRoomHeadcountField
          value={memberCount}
          onChange={setMemberCount}
        />
        <CreateRoomGoalField value={targetBingo} onChange={setTargetBingo} />

        <section className="bg-bg-gray rounded-16 flex flex-col gap-1.5 p-4">
          <h2 className="body5 text-text-title font-bold">
            📌 방 종료 조건 안내
          </h2>
          <p className="body5 text-text-secondary-1">
            설정한 목표 빙고 줄(또는 모든 칸)이 채워지는 경우 방이 종료됩니다.
          </p>
        </section>
      </div>

      <footer className="border-border-1 border-t px-5 pt-4 pb-8">
        <BottomButton disabled={!isSubmittable}>빙고판 만들기</BottomButton>
      </footer>
    </main>
  );
};

export default CreateRoomPage;
