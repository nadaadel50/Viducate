import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";
export const QuizTimer = ({ timeLeft }: any) => {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: COLORS.border.default }}>
      <div className="flex items-center gap-2 mb-4" style={{ color: COLORS.text.secondary }}>
        <span className="material-symbols-outlined">timer</span>
        <span className="text-sm font-bold uppercase"><FormattedMessage id="quiz.time_remaining" /></span>
      </div>
      <div className="flex items-center justify-center gap-2 p-4 rounded-xl" style={{ backgroundColor: COLORS.icon.background }}>
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color: COLORS.text.primary }}>{min.toString().padStart(2, "0")}</div>
          <div className="text-[10px] font-bold opacity-50"><FormattedMessage id="quiz.min" /></div>
        </div>
        <span className="text-2xl font-bold opacity-30">:</span>
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color: COLORS.text.primary }}>{sec.toString().padStart(2, "0")}</div>
          <div className="text-[10px] font-bold opacity-50"><FormattedMessage id="quiz.sec" /></div>
        </div>
      </div>
    </div>
  );
};