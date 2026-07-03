import clsx from "clsx";
import { Clock } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { COLORS } from "../../../../core/constants/colors";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

interface SummaryHeaderProps {
  title: string;
  time: string;
}

export function SummaryHeader({ title, time }: SummaryHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4 sm:gap-3">
        <span
          className={clsx(
            FONT_STYLES.topicStatus,
            "inline-flex items-center gap-2 rounded-full px-3 py-1",
          )}
          style={{
            backgroundColor: COLORS.state.successLight,
            color: COLORS.state.success,
          }}
        >
          <span
            className="h-2 w-2 animate-pulse rounded-full"
            style={{ backgroundColor: COLORS.state.success }}
          />

          <FormattedMessage id="summary.aiReady" />
        </span>

        <span
          className={clsx(
            FONT_SIZE.size12,
            FONT_WEIGHT.medium,
            "inline-flex items-center gap-1",
          )}
          style={{ color: COLORS.brand.primary }}
        >
          <Clock size={14} />
          {time}
        </span>
      </div>

      <h1
        className={clsx(FONT_STYLES.pageTitle, "break-words")}
        style={{ color: COLORS.text.primary }}
      >
        {title}
      </h1>
    </header>
  );
}
