import { useEffect, useState } from "react";
import { ContentLearningCard } from "../widgets/content_learning_card";
import { SearchTopicBar } from "../widgets/search_topic_bar";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { ChartColumn, ClipboardCheck, Languages, Target } from "lucide-react";
import { CustomizeExperienceModal } from "../../../preferences/presentation/pages/CustomizeExperienceModal";
import { useNavigate } from "react-router-dom";
import { AppRoutesNames } from "../../../../app/routers/routes";

export function LeftContentSection() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const navigate = useNavigate();
  const {
    currentTime,
    setSelectedTopic,
    setSeekTo,
    topics,
    videoTitle,
    videoId,
  } = useLearningSession();

  const currentTopicIndex = topics
    ? topics.findIndex(
        (topic) =>
          currentTime >= topic.start_time && currentTime < topic.end_time,
      )
    : -1;

  useEffect(() => {
    if (currentTopicIndex === -1) return;

    const newTopic = topics![currentTopicIndex];

    setSelectedTopic((prev) => {
      if (prev?.segment_id === newTopic.segment_id) return prev;
      return newTopic;
    });
  }, [currentTopicIndex]);

  //  filter
  if (!topics) return null;
  const filteredCards = topics!.filter((item) => {
    if (!searchQuery) return true;

    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full w-full ">
      {/* SEARCH */}
      <div className="p-4 border-b border-slate-100">
        <SearchTopicBar setSearchQuery={setSearchQuery} />
      </div>

      <div className="px-5 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-400 tracking-wide hover:text-[#4f46e5]">
            {`${videoTitle} Topics`}
          </h2>

          <div className="flex items-center gap-3">
            <span
              className="relative group text-slate-400 hover:text-[#4f46e5] cursor-pointer"
              onClick={() => navigate(AppRoutesNames.report)}
            >
              <ClipboardCheck   size={18} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Learning Report
              </span>
            </span>

            <span
              className="relative group text-slate-400 hover:text-[#4f46e5] cursor-pointer"
              onClick={() => setIsCustomizeOpen(true)}
            >
              <Languages size={18} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Change Topics Language
              </span>
            </span>
          </div>
        </div>
      </div>
      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 p-4 max-w-md mx-auto w-full">
          {filteredCards.map((card, index) => (
            <ContentLearningCard
              key={index}
              isSelected={currentTopicIndex === index}
              onClick={() => {
                setSelectedTopic(card);
                setSeekTo(card.start_time);
              }}
              cardInfo={card}
            />
          ))}
        </div>
      </div>

      {isCustomizeOpen && (
        <CustomizeExperienceModal
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          videoId={videoId}
        />
      )}
    </div>
  );
}
