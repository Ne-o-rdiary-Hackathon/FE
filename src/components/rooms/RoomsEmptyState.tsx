export const RoomsEmptyState = () => (
  <div className="m-auto flex flex-col items-center gap-2">
    <span
      aria-hidden="true"
      className="bg-bg-gray text-text-secondary-2 rounded-pill flex h-13.5 w-13.5 items-center justify-center text-2xl"
    >
      !
    </span>
    <p className="body3 text-text-secondary-2">아직 참여한 모임이 없어요</p>
  </div>
);
