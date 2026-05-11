export function formatMessageTime(
  timestamp: number | string | Date
): string {
  return new Date(timestamp)
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
}