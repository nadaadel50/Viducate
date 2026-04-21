export function PopupOnTimeline({
  currentTime,
  duration,
  onClose,
}: {
  currentTime: number;
  duration: number;
  onClose: () => void;
}) {
  const percent = Math.min(95, Math.max(5, (currentTime / duration) * 100));

  return (
    <div
      className="absolute bottom-full mb-4 -translate-x-1/2 z-50"
      style={{ left: `${percent}%` }}
    >
      <div className="w-72 bg-white rounded-2xl shadow-xl border p-4">
        <p className="text-sm text-center mb-3">
          I see you are stuck here, do you want any help?
        </p>

        <div className="flex gap-2">
          <button className="flex-1 bg-primary text-white py-2 rounded-lg text-xs">
            Yes, help me
          </button>

          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded-lg text-xs"
          >
            No, I'm okay
          </button>
        </div>
      </div>
    </div>
  );
}
