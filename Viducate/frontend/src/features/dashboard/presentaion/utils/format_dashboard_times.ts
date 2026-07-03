import type { IntlShape } from "react-intl";

export function formatTimeToHoursMinutes(
  seconds: number,
  intl: IntlShape,
): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return intl.formatMessage(
    { id: "common.time.hoursMinutes" },
    { hours, minutes },
  );
}

export function formatVideoTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
