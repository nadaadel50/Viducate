import { RotateCcw, X } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../../core/constants/colors";
import type { VideoStatusEntity } from "../../../domain/entity/video_status_entity";

type ProcessingActionsProps = {
  status: VideoStatusEntity["status"];
  onRetry: () => void;
  onCancel: () => void;
};

export function ProcessingActions({
  status,
  onRetry,
  onCancel,
}: ProcessingActionsProps) {
  if (status === "completed") return null;

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center gap-3 md:gap-4 w-full pb-4 md:pb-6">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-sm font-semibold text-white transition-all active:scale-95 shadow-lg shadow-indigo-200/50 group"
          style={{
            backgroundColor: COLORS.brand.primary,
          }}
        >
          <RotateCcw
            size={18}
            className="group-hover:rotate-[-180deg] transition-transform"
          />

          <FormattedMessage id="analysis.retry" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 md:gap-4 w-full pb-4 md:pb-6">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:text-red-500 cursor-pointer active:scale-95"
        style={{
          color: COLORS.text.muted,
        }}
      >
        <X size={12} />
        <FormattedMessage id="analysis.cancel" />
      </button>
    </div>
  );
}
