import { FONT_STYLES } from "../../../../../core/constants/fonts";
import { FormattedMessage } from "react-intl";
type StuckPopupProps = {
  reason: string;
  onHelp: () => void;
  onDismiss: () => void;
};

export function StuckPopup({ reason, onHelp, onDismiss }: StuckPopupProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 rounded-xl border border-white/10 bg-[#1a1a2e] p-4 text-white shadow-2xl sm:bottom-5 sm:left-auto sm:right-5 sm:w-full sm:translate-x-0">
      <p className={`${FONT_STYLES.body} leading-relaxed`}>{reason} 👀</p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={onHelp}
          className="cursor-pointer rounded-lg bg-gradient-to-r from-[#359EFF] to-[#5A0BB1] px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          <>
            <FormattedMessage id="watch.stuck.help" /> 😊
          </>
        </button>

        <button
          onClick={onDismiss}
          className="cursor-pointer rounded-lg px-3 py-2 text-xs text-white/60 transition hover:text-white"
        >
          <>
            <FormattedMessage id="watch.stuck.dismiss" /> 😏
          </>
        </button>
      </div>
    </div>
  );
}
