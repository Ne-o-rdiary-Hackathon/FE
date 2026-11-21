import { IcPlus } from "@/components/icons";

export const RoomActionButton = () => (
  <div className="pointer-events-none fixed inset-x-0 bottom-7 z-20 mx-auto flex w-full max-w-md justify-end px-5">
    <button
      type="button"
      aria-label="방 생성 및 참여"
      className="bg-primary-normal text-text-white pointer-events-auto flex size-15 items-center justify-center rounded-full shadow-sm transition-transform active:scale-95"
    >
      <IcPlus size={32} />
    </button>
  </div>
);
