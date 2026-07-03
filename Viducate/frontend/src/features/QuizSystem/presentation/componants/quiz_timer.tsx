import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

interface QuizTimerProps {
  timeLeft: number;
  compact?: boolean;
}

export function QuizTimer({ timeLeft, compact = false }: QuizTimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (compact) {
    return (
      <div
        className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 shadow-sm"
        style={{ borderColor: COLORS.border.default }}
      >
        <div
          className="flex items-center gap-2"
          style={{ color: COLORS.text.secondary }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            timer
          </span>

          <span className={`${FONT_SIZE.size12} ${FONT_WEIGHT.semibold}`}>
            <FormattedMessage id="quiz.time_remaining" />
          </span>
        </div>

        <span
          className={`${FONT_SIZE.size16} ${FONT_WEIGHT.bold}`}
          style={{ color: COLORS.text.primary }}
        >
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
    );
  }
  return (
    <section
      className="rounded-xl border bg-white p-4 shadow-sm md:p-5"
      style={{ borderColor: COLORS.border.default }}
    >
      <div
        className="mb-3 flex items-center gap-2"
        style={{ color: COLORS.text.secondary }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
          timer
        </span>

        <span className={`${FONT_SIZE.size12} ${FONT_WEIGHT.bold}`}>
          <FormattedMessage id="quiz.time_remaining" />
        </span>
      </div>

      <div
        className="flex items-center justify-center gap-2 rounded-lg p-3"
        style={{ backgroundColor: COLORS.icon.background }}
      >
        <div className="text-center">
          <div
            className={`${FONT_SIZE.size24} ${FONT_WEIGHT.bold}`}
            style={{ color: COLORS.text.primary }}
          >
            {minutes.toString().padStart(2, "0")}
          </div>

          <div className={`${FONT_SIZE.size10} ${FONT_WEIGHT.bold} opacity-50`}>
            <FormattedMessage id="quiz.min" />
          </div>
        </div>

        <span className={`${FONT_SIZE.size20} ${FONT_WEIGHT.bold} opacity-30`}>
          :
        </span>

        <div className="text-center">
          <div
            className={`${FONT_SIZE.size24} ${FONT_WEIGHT.bold}`}
            style={{ color: COLORS.text.primary }}
          >
            {seconds.toString().padStart(2, "0")}
          </div>

          <div className={`${FONT_SIZE.size10} ${FONT_WEIGHT.bold} opacity-50`}>
            <FormattedMessage id="quiz.sec" />
          </div>
        </div>
      </div>
    </section>
  );
}
