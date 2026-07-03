import { COLORS } from "../../../../../core/constants";
import type { ContinueLearningEntity } from "../../../domain/entity/continue_learning";
import { formatVideoTime } from "../../utils/format_dashboard_times";
import { FormattedMessage } from "react-intl";
type CardLayoutProps = {
  cardData: ContinueLearningEntity;
};

export function CardLayout({ cardData }: CardLayoutProps) {
  const isLink = cardData.video_type === "url";
  const progress =
    cardData.duration > 0
      ? Math.min((cardData.currentTime / cardData.duration) * 100, 100)
      : 0;

  const timeLeft = cardData.remainingTime ?? cardData.duration;

  return (
    <div className="relative aspect-video bg-slate-200 overflow-hidden rounded-t-2xl">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${cardData.thumbnail_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/50 shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
          <span className="material-symbols-outlined text-white text-2xl">
            play_arrow
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200/30">
        <div
          className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Badge */}
      {timeLeft && (
        <div className="absolute top-3 right-3 bg-black/50 text-white text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
          <FormattedMessage
            id="dashboard.continueLearning.timeLeft"
            values={{ time: formatVideoTime(timeLeft) }}
          />
        </div>
      )}

      {/* Link or Video Badge */}
      <div
        className="absolute top-3 left-3 text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
        style={{ background: COLORS.brand.gradient }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
          {isLink ? "link" : "video_file"}
        </span>
        <span>
          {isLink ? (
            <FormattedMessage id="dashboard.continueLearning.link" />
          ) : (
            <FormattedMessage id="dashboard.continueLearning.uploaded" />
          )}
        </span>
      </div>
    </div>
  );
}
