import { useMemo, useState } from "react";
import { useDashboard } from "../../hooks/use_dashboard";
import { ContinueLearningCard } from "./cotinue_learning_card";
import { VideoFilterButton } from "./video_filter_btn";
import { FONT_STYLES } from "../../../../../core/constants/fonts";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

export function ContinueLearningPart() {
  const { data, uploaded_videos, linked_videos } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const intl = useIntl();
  const cardsData = useMemo(() => {
    if (!data?.continue_learning) return [];

    let result = data.continue_learning;

    if (uploaded_videos && !linked_videos) {
      result = result.filter((card) => card.video_type === "upload");
    } else if (linked_videos && !uploaded_videos) {
      result = result.filter((card) => card.video_type === "url");
    }

    if (searchQuery) {
      result = result.filter((card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return result;
  }, [data, uploaded_videos, linked_videos, searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className={`${FONT_STYLES.sectionTitle} text-slate-900`}>
        <FormattedMessage id="dashboard.continueLearning.title" />
      </h2>

      <div className="flex  w-full max-w-4xl items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 text-base">
              search
            </span>
          </div>

          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all shadow-soft"
            placeholder={intl.formatMessage({
              id: "dashboard.continueLearning.searchPlaceholder",
            })}
          />
        </div>

        <VideoFilterButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4  gap-4">
        {cardsData.length !== 0 ? (
          cardsData.map((card, index) => (
            <div
              key={card.videoId}
              className="opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${Math.min(index * 60, 400)}ms`,
              }}
            >
              <ContinueLearningCard cardData={card} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-12 px-4">
            <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">
              videocam_off
            </span>

            <h3 className={`${FONT_STYLES.cardTitle} text-slate-900`}>
              <FormattedMessage id="dashboard.continueLearning.empty.title" />
            </h3>

            <p className={`${FONT_STYLES.caption} mt-1 max-w-xs`}>
              <FormattedMessage id="dashboard.continueLearning.empty.description" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
