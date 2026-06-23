import { useMemo, useState } from "react";
import { useDashboard } from "../../hooks/use_dashboard";
import { ContinueLearningCard } from "./cotinue_learning_card";
import { VideoFilterButton } from "./video_filter_btn";

export function ContinueLearningPart() {
  const { data, uploaded_videos, linked_videos } = useDashboard();
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      <h2 className="text-2xl font-bold text-slate-900">Continue Learning</h2>

      <div className="flex gap-4 items-center">
        <div className="relative w-full max-w-4xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">
              search
            </span>
          </div>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-display transition-all shadow-soft"
            placeholder="Search for saved videos..."
          />
        </div>

        <div>
          <VideoFilterButton />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {cardsData.length !== 0 ? (
          cardsData.map((card, index) => (
            <div
              key={card.videoId}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
            >
              <ContinueLearningCard cardData={card} />
            </div>
          ))
        ) : (
          <div className="col-span-4 flex flex-col items-center justify-center text-center py-16 px-6 ">
            <span className="material-symbols-outlined text-slate-300 text-5xl mb-3">
              videocam_off
            </span>
            <h3 className="text-lg font-semibold text-slate-900 font-display">
              No videos found
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              Try a different search term, or upload a video to start learning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
