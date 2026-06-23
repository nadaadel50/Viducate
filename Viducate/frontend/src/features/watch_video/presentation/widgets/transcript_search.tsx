import { PlayCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useSearchMutation } from "../hook/use_search";

export function TranscriptSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const { videoId, setSeekTo } = useLearningSession();

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


  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto">
      <div className="relative group w-full">
        <Search className="text-slate-400 absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#4f46e5] transition-colors" />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search with any keyword in the video..."
          className="placeholder:text-slate-400 w-full bg-white border border-slate-200 shadow-sm rounded-xl py-3 px-10 focus:border-[#4f46e5] focus:ring-[#4f46e5] focus:ring-1 focus:outline-none transition"
        />
      </div>
      {isQueryTooShort && (
        <p className="text-xs text-slate-500 px-1">
          Search term is too short. Enter at least 3 characters.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">Failed to search transcript</p>
      )}
      {hasNoResults && (
        <p className="text-xs text-slate-500 px-1">
            No results found for "{searchQuery}"
        </p>
       
      )}

      {isLoadingQuery ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-[#4f46e5] rounded-full animate-spin" />
        </div>
      ) : (
        searchResults.map((item) => (
          <button
            key={item.subtopic_id}
            onClick={() => setSeekTo(item.start_time)}
            className="cursor-pointer w-full text-left group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 hover:bg-slate-50 hover:border-[#4f46e5]/40 transition shadow-sm"
          >
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-500 group-hover:bg-[#4f46e5]/10 group-hover:text-[#4f46e5] transition">
                <PlayCircle size={16} className="mr-1" />
                {formatTime(item.start_time)}
              </span>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {item.sub_topic_description}
            </p>
          </button>
        ))
      )}
    </div>
  );
}
