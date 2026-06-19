import { Video, X } from "lucide-react";

type VideoDragedSectionProps = {
  videoFile: File | null;
  handleCancel: () => void;
};

export function VideoDragedSection({
  videoFile,
  handleCancel,
}: VideoDragedSectionProps) {
  const sizeMB = videoFile
    ? (videoFile.size / (1024 * 1024)).toFixed(2) + " MB"
    : "";

  return (
    <div className="w-full mt-10 mb-6 bg-white border border-[#E0DCFB] rounded-2xl p-4">
      <div className="flex items-center gap-4">

        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-500 shrink-0">
          <Video size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {videoFile?.name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{sizeMB}</p>
        </div>

        <button
          onClick={handleCancel}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400
            hover:bg-red-50 hover:text-red-500 hover:border-red-200
            transition-all duration-150 shrink-0 cursor-pointer"
          aria-label="Remove video"
        >
          <X size={15} />
        </button>

      </div>
    </div>
  );
}
