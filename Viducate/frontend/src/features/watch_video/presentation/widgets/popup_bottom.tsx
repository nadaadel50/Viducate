export function PopupBottomRight({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 w-72 bg-white rounded-2xl shadow-xl border p-4 z-50">
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
  );
}

