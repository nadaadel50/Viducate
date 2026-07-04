export function cleanSummaryText(text: string): string {
  return text.replace(/\*\*/g, "");
}
