import { Video, X } from "lucide-react";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { useIntl } from "react-intl";
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
const intl = useIntl();
  return (
    <div className="w-full mt-6 md:mt-8 mb-4 md:mb-6 bg-white border border-[#E0DCFB] rounded-xl md:rounded-2xl p-3 md:p-4">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-indigo-50 text-indigo-500 shrink-0">
          <Video size={18} className="md:w-5 md:h-5" />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <p className={`${FONT_STYLES.body} font-medium text-gray-800 truncate`}>
            {videoFile?.name}
          </p>

          <p className={FONT_STYLES.caption}>
            {sizeMB}
          </p>
        </div>

        <button
          onClick={handleCancel}
          aria-label={intl.formatMessage({
  id: "upload.video.remove"
})}
          className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-150 shrink-0 cursor-pointer"
        >
          <X size={14} className="md:w-[15px] md:h-[15px]" />
        </button>
      </div>
    </div>
  );
}