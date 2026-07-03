import { useLearningSession } from "../../../../core/hooks/useLearningContent";
const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
};

export function useVideoProgress() {
  const { currentTime, duration } = useLearningSession();

  const percent =
    duration && duration > 0
      ? Math.min(Math.round((currentTime / duration) * 100), 100)
      : 0;

  return {
    percent,
    remaining: 100 - percent,
    watchedFormatted: formatTime(currentTime),
    totalFormatted: duration ? formatTime(duration) : "0:00",
  };
}
