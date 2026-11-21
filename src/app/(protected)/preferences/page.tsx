import { PreferenceSelection } from "@/components/preferences/PreferenceSelection";

const PreferencesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string }>;
}) => {
  const { roomId } = await searchParams;
  const parsed = roomId && /^\d+$/.test(roomId) ? Number(roomId) : NaN;
  return (
    <PreferenceSelection
      roomId={Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null}
    />
  );
};

export default PreferencesPage;
