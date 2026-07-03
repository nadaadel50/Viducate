import { FormattedMessage } from "react-intl";

import { COLORS } from "../../../../core/constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";

interface QuizProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export function QuizProgressBar({
  current,
  total,
  percentage,
}: QuizProgressBarProps) {
  return (
    <section
      className="mb-4 rounded-xl border bg-white p-3 shadow-sm md:mb-5 md:p-5"
      style={{ borderColor: COLORS.border.default }}
    >
      <div className="mb-3 flex items-end justify-between gap-3">
        <span
          className={`${FONT_SIZE.size12} md:${FONT_SIZE.size14} ${FONT_WEIGHT.semibold} ${LETTER_SPACING.wide}`}
          style={{ color: COLORS.brand.primary }}
        >
          <FormattedMessage
            id="quiz.question_count"
            values={{ current, total }}
          />
        </span>

        <span
          className={`${FONT_SIZE.size12} md:${FONT_SIZE.size14} ${FONT_WEIGHT.bold}`}
          style={{ color: COLORS.text.primary }}
        >
          {Math.round(percentage)}%
        </span>
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: COLORS.state.pending }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: COLORS.brand.gradient,
          }}
        />
      </div>
    </section>
  );
}
