import { FormattedMessage } from "react-intl";
import type { VideoReport } from "../_temp_mock";
import { useVideoProgress } from "../hooks/use_video_progress";

interface VideoHeroProps {
  report: VideoReport;
}

export function VideoHero({ report }: VideoHeroProps) {
  const { percent, remaining, watchedFormatted, totalFormatted } = useVideoProgress();

  return (
    <div className="glass rounded-2xl overflow-hidden mb-5 p-6 md:p-8 animate-fade-slide bg-white/80 backdrop-blur-md border border-white/60 shadow-lg">
      {/* Badge
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
          📅{' '}
          <FormattedMessage
            id="report.hero.lastStudied"
            defaultMessage="Last studied {date}"
            values={{ date: report.lastStudied }}
          />
        </span>
      </div> */}

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-snug">
        {report.title}
      </h2>
      <p className="text-slate-500 text-sm mb-6 font-medium">
        <FormattedMessage
          id="report.hero.uploadedAt"
          values={{ date: report.uploadedAt, count: report.topics.length }}
        />
      </p>

      {/* Progress Bar */}
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-600 font-semibold">
          <FormattedMessage id="report.hero.watchProgress" />
        </span>
        <span className="font-bold text-slate-900">
          {watchedFormatted}{ " " }
          <span className="text-slate-400 font-medium">
            / {totalFormatted}
          </span>
        </span>
      </div>

      <div className="h-4 rounded-full overflow-hidden bg-slate-100 shadow-inner">
        <div
          className="h-full rounded-full relative"
          style={{
            width: `${percent}%`,
            backgroundImage:
              "linear-gradient(to bottom right, #359EFF, #5A0BB1)",
          }}
        >
          <div
            className="absolute inset-0 bg-white/20 w-full"
            style={{ animation: "shimmer 2s infinite" }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
        <span>
          <FormattedMessage
            id="report.hero.watched"
            values={{ percent}}
          />
        </span>
        <span>
          <FormattedMessage
            id="report.hero.remaining"
            values={{ percent: remaining }}
          />
        </span>
      </div>

      {/* Overall Score */}
      {/* <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="px-6 py-3 rounded-xl font-extrabold text-xl text-white bg-#4f46e5=== flex items-center justify-center gap-2">
          {report.overallScore}%
          <span className="text-sm font-medium text-white/80">
            <FormattedMessage id="report.hero.overallScore" defaultMessage="overall score" />
          </span>
        </div>
        <div className="text-sm font-medium text-slate-600 bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl flex-1 text-center sm:text-left shadow-sm">
          <FormattedMessage
            id="report.hero.quizResult"
            defaultMessage="You got {correct} out of {total} quiz answers correct!"
            values={{
              correct: <span className="font-bold text-slate-900">{report.correctAnswers}</span>,
              total:   <span className="font-bold text-slate-900">{report.totalQuizQuestions}</span>,
            }}
          />
        </div>
      </div> */}
    </div>
  );
}
