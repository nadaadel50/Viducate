export function formatStorage(bytes: number): string {
  const mb = bytes / (1024 * 1024);

  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }

  const gb = mb / 1024;

  return `${gb.toFixed(1)} GB`;
}
