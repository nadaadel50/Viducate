import { useEffect, useState } from "react";
import { useRef } from "react";
import { ClipboardCheck, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { CustomizeExperienceModal } from "../../../preferences/presentation/pages/customize_experience_modal";
import { SearchTopicBar } from "../widgets/search_topic_bar";
import { ContentLearningCard } from "../widgets/content_learning_card";
import { FormattedMessage } from "react-intl";
type LeftContentSectionProps = {
  onClose?: () => void;
};
export function LeftContentSection({ onClose }: LeftContentSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    cardRefs.current[currentTopicIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const newTopic = topics![currentTopicIndex];

    setSelectedTopic((prev) => {
      if (prev?.segment_id === newTopic.segment_id) return prev;
      return newTopic;
    });
  }, [currentTopicIndex]);

  if (!topics) return null;

  const filteredCards = topics.filter((item) => {
    if (!searchQuery) return true;

    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="border-b border-slate-100 p-3">
        <SearchTopicBar setSearchQuery={setSearchQuery} />
      </div>

      <div className="px-3 py-2 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <h2
            className={`${FONT_STYLES.label} flex-1 truncate text-slate-400 tracking-wide hover:text-[#4f46e5]`}
          >
            <>
              {videoTitle} <FormattedMessage id="watch.topics.title" />
            </>
          </h2>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span
              className="group relative cursor-pointer text-slate-400 transition-colors hover:text-[#4f46e5]"
              onClick={() => navigate(AppRoutesNames.report)}
            >
              <ClipboardCheck size={18} />

              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                <FormattedMessage id="watch.tooltip.report" />
              </span>
            </span>

            <span
              className="group relative cursor-pointer text-slate-400 transition-colors hover:text-[#4f46e5]"
              onClick={() => setIsCustomizeOpen(true)}
            >
              <Languages size={18} />

              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                <FormattedMessage id="watch.tooltip.changeLanguage" />
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto">
        <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-3 sm:max-w-lg sm:p-4 lg:max-w-xl">
          {filteredCards.map((card, index) => (
            <div
              key={card.segment_id ?? index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              <ContentLearningCard
                isSelected={currentTopicIndex === index}
                onClick={() => {
                  setSelectedTopic(card);
                  setSeekTo(card.start_time);
                  onClose?.();
                }}
                cardInfo={card}
              />
            </div>
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
