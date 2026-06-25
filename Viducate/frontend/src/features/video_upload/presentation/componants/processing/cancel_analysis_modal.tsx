import { AlertTriangle} from "lucide-react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../../core/constants/colors";
import { BaseModal } from "../../../../../core/componants/base_modal";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CancelAnalysisModal({ isOpen, isLoading, onConfirm, onCancel }: Props) {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel} maxWidth="max-w-md">
      <div className="p-8 flex flex-col items-center text-center gap-6">
        
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={32} className="text-red-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black" style={{ color: COLORS.text.primary }}>
            <FormattedMessage id="analysis.cancel.title" defaultMessage="Cancel Analysis?" />
          </h2>
          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
            <FormattedMessage
              id="analysis.cancel.subtitle"
              defaultMessage="Are you sure you want to cancel? All progress will be lost."
            />
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl font-bold border-2 text-sm transition-all hover:bg-slate-50"
            style={{ borderColor: COLORS.border.default, color: COLORS.text.secondary }}
          >
            <FormattedMessage id="analysis.cancel.keep" defaultMessage="Keep Waiting" />
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: "#e11d48" }}
          >
            {isLoading ? (
              <span className="animate-pulse">
                <FormattedMessage id="analysis.cancel.cancelling" defaultMessage="Cancelling..." />
              </span>
            ) : (
              <FormattedMessage id="analysis.cancel.confirm" defaultMessage="Yes, Cancel" />
            )}
          </button>
        </div>

      </div>
    </BaseModal>
  );
}