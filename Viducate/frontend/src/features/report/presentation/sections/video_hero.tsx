import { FormattedMessage, useIntl } from "react-intl";

import { COLORS } from "../../../../core/constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

import { formatDate } from "../../../../core/utils/format_date";
import { useVideoProgress } from "../hooks/use_video_progress";

import type { VideoReport } from "../../domain/entity/report_entity";

interface VideoHeroProps {
  report: VideoReport;
}

export function VideoHero({ report }: VideoHeroProps) {
  const { locale } = useIntl();

  const { percent, remaining, watchedFormatted, totalFormatted } =
    useVideoProgress();

  const formattedDate = formatDate(report.updatedAt, locale);

  return (
    <section
      className="mb-5 rounded-2xl border bg-white/80 p-5 shadow-lg backdrop-blur-md md:p-7"
      style={{
        borderColor: COLORS.border.default,
      }}
    >
      <h2
        className={`${FONT_SIZE.size24} md:text-3xl ${FONT_WEIGHT.bold} mb-2 leading-snug`}
        style={{ color: COLORS.text.primary }}
      >
        {report.title}
      </h2>

      <p
        className={`${FONT_SIZE.size13} mb-5`}
        style={{ color: COLORS.text.secondary }}
      >
        <FormattedMessage
          id="report.hero.updatedAt"
          values={{
            date: formattedDate,
            count: report.topics.length,
          }}
        />
      </p>

      <div className="mb-2 flex items-center justify-between gap-3">
        <span
          className={`${FONT_SIZE.size14} ${FONT_WEIGHT.semibold}`}
          style={{ color: COLORS.text.secondary }}
        >
          <FormattedMessage id="report.hero.watchProgress" />
        </span>

        <span
          className={`${FONT_SIZE.size14} ${FONT_WEIGHT.bold}`}
          style={{ color: COLORS.text.primary }}
        >
          {watchedFormatted}

          <span
            className={`${FONT_WEIGHT.medium}`}
            style={{ color: COLORS.text.gray }}
          >
            {" "}
            / {totalFormatted}
          </span>
        </span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full"
        style={{ backgroundColor: COLORS.state.pending }}
      >
        <div
          className="relative h-full rounded-full"
          style={{
            width: `${percent}%`,
            background: COLORS.brand.gradient,
          }}
        >
          <div
            className="absolute inset-0 bg-white/20"
            style={{
              animation: "shimmer 2s infinite",
            }}
          />
        </div>
      </div>

      <div
        className={`mt-2 flex items-center justify-between ${FONT_SIZE.size11} ${FONT_WEIGHT.medium}`}
        style={{ color: COLORS.text.secondary }}
      >
        <span>
          <FormattedMessage id="report.hero.watched" values={{ percent }} />
        </span>

        <span>
          <FormattedMessage
            id="report.hero.remaining"
            values={{ percent: remaining }}
          />
        </span>
      </div>
    </section>
  );
}
