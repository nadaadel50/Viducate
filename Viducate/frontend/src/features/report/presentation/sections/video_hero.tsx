import { FormattedMessage, useIntl } from "react-intl";
import type { VideoReport } from "../../domain/entity/report_entity";
import { useVideoProgress } from "../hooks/use_video_progress";
import { formatDate } from "../componants/format_date";

export function VideoHero({ report }: { report: VideoReport }) {
  const { percent, remaining, watchedFormatted, totalFormatted } = useVideoProgress();
    const { locale } = useIntl();
  const formattedDate = formatDate(report.updatedAt, locale);
  return (
    <div className="glass rounded-2xl overflow-hidden mb-5 p-6 md:p-8 animate-fade-slide bg-white/80 backdrop-blur-md border border-white/60 shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-snug">{report.title}</h2>
      <p className="text-slate-500 text-sm mb-6 font-medium">
        <FormattedMessage id="report.hero.updatedAt" values={{ date: formattedDate, count: report.topics.length }} />
      </p>

      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-600 font-semibold"><FormattedMessage id="report.hero.watchProgress" /></span>
        <span className="font-bold text-slate-900">
          {watchedFormatted} <span className="text-slate-400 font-medium">/ {totalFormatted}</span>
        </span>
      </div>

      <div className="h-4 rounded-full overflow-hidden bg-slate-100 shadow-inner">
        <div className="h-full rounded-full relative" style={{ width: `${percent}%`, backgroundImage: "linear-gradient(to bottom right, #359EFF, #5A0BB1)" }}>
          <div className="absolute inset-0 bg-white/20 w-full" style={{ animation: "shimmer 2s infinite" }} />
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
        <span><FormattedMessage id="report.hero.watched" values={{ percent }} /></span>
        <span><FormattedMessage id="report.hero.remaining" values={{ percent: remaining }} /></span>
      </div>
    </div>
  );
}