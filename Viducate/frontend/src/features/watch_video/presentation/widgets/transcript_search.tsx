import { PlayCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useSearchMutation } from "../hook/use_search";
import { formatVideoTime } from "../../../../core/utils/fomat_time";
import { useIntl } from "react-intl";
export function TranscriptSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const { videoId, setSeekTo } = useLearningSession();
  const intl = useIntl();
  const {
    sendQuery,
    data: searchResults = [],
    isLoadingQuery,
    error,
    reset,
  } = useSearchMutation();

  const hasNoResults =
    !isLoadingQuery &&
    searchQuery.trim().length >= 3 &&
    searchResults.length === 0;

  const isQueryTooShort =
    searchQuery.trim().length > 0 && searchQuery.trim().length < 3;

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3 || !videoId) {
      reset();
      return;
    }

    const timer = setTimeout(() => {
      sendQuery({
        query: searchQuery.trim(),
        videoId,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, videoId]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 ">
      <div className="group relative w-full ">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#4f46e5]" />

        <input
          type="text"
          value={searchQuery}
          placeholder={intl.formatMessage({
            id: "watch.search.placeholder",
          })}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 shadow-sm placeholder:text-slate-400 focus:border-[#4f46e5] focus:outline-none focus:ring-1 focus:ring-[#4f46e5] ${FONT_STYLES.input}`}
        />
      </div>

      {isQueryTooShort && (
        <p className={`${FONT_STYLES.caption} px-1 text-slate-500`}>
          {intl.formatMessage({
            id: "watch.search.tooShort",
          })}
        </p>
      )}

      {error && (
        <p className={`${FONT_STYLES.error} text-red-500`}>
          {intl.formatMessage({
            id: "watch.search.failed",
          })}
        </p>
      )}

      {hasNoResults && (
        <p className={`${FONT_STYLES.caption} px-1 text-slate-500`}>
          {intl.formatMessage(
            {
              id: "watch.search.noResults",
            },
            {
              query: searchQuery,
            },
          )}
        </p>
      )}

      {isLoadingQuery ? (
        <div className="flex justify-center py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#4f46e5]" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-2">
          {searchResults.map((item) => (
            <button
              key={item.subtopic_id}
              onClick={() => setSeekTo(item.start_time)}
              className="group flex w-full cursor-pointer flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-[#4f46e5]/40 hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-4 sm:p-2"
            >
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`${FONT_STYLES.topicStatus} flex items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-500 transition group-hover:bg-[#4f46e5]/10 group-hover:text-[#4f46e5]`}
                >
                  <PlayCircle size={12} className="mr-1" />
                  {formatVideoTime(item.start_time)}
                </span>
              </div>

              <p
                className={`${FONT_STYLES.caption} line-clamp-2 leading-relaxed text-slate-600`}
              >
                {item.sub_topic_description}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
