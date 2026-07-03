export function formatMessageTime(timestamp: number | string | Date): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
export function formatVideoTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
export function getFormattedTimeParts(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return {
    minutes: minutes.toString().padStart(2, "0"),
    seconds: remainingSeconds.toString().padStart(2, "0"),
  };
}
