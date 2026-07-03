export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
