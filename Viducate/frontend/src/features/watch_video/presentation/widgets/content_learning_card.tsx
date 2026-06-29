import { useState } from "react";
import {
  Check,
  FileQuestion,
  Layers,
  NotebookText,
  TvMinimalPlay,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";

import { AppRoutesNames } from "../../../../app/routers/routes";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { formatVideoTime } from "../../../../core/utils/fomat_time";

import type { TopicResponse } from "../../domin/entity/topic_response";
import { ContentGenerationBtn } from "./content_genration_btn";

import { useDueFlashcards } from "../../../flash_cards/presentation/hooks/use_due_flash_cards";
import { QuizDifficultyModal } from "../../../QuizSystem/presentation/componants/quiz_difficulty_modal";
import { SummaryStyleModal } from "../../../summarization/presentation/componants/summary_style_modal";

type ContentLearningCardProps = {
  isSelected: boolean;
  onClick: () => void;
  cardInfo: TopicResponse;
};

export function ContentLearningCard({
  isSelected,
  onClick,
  cardInfo,
}: ContentLearningCardProps) {
  const navigate = useNavigate();
  const intl = useIntl();

  const { setSelectedTopic, videoId, completedTopics } =
    useLearningSession();

  const { isDueForSegment } = useDueFlashcards();

  const [isQuizModalOpen, setIsQuizModalOpen] =
    useState(false);

  const [isSummaryModalOpen, setIsSummaryModalOpen] =
    useState(false);

  const isDue = isDueForSegment(cardInfo.segment_id);
  const isCompleted = completedTopics.has(cardInfo.segment_id);

  const handleQuizClick = () => {
    const savedKey = localStorage.getItem(
      `active_quiz_key_${cardInfo.segment_id}`,
    );

    if (savedKey) {
      navigate(
        `${AppRoutesNames.quiz}/${cardInfo.segment_id}`,
        {
          state: {
            videoId,
            segmentId: cardInfo.segment_id,
            quizKey: savedKey,
          },
        },
      );
      return;
    }

    setIsQuizModalOpen(true);
  };

  const handleSummarySelect = (
    style: "summary" | "study_notes",
  ) => {
    if (style === "summary") {
      navigate(
        `${AppRoutesNames.summary}/${cardInfo.segment_id}`,
        {
          state: {
            videoId,
            segmentId: cardInfo.segment_id,
          },
        },
      );
      return;
    }

    navigate(
      `${AppRoutesNames.studyNotes}/${cardInfo.segment_id}`,
      {
        state: {
          videoId,
          segmentId: cardInfo.segment_id,
        },
      },
    );
  };

  return (
    <>
      <div
        onClick={() => {
          onClick();
          setSelectedTopic(cardInfo);
        }}
        className={`group relative cursor-pointer rounded-xl border-2 bg-white/70 px-2.5 py-2.5 transition-all hover:border-primary/40 hover:bg-white hover:shadow-soft ${
          isSelected
            ? "border-[#4f46e5] shadow-xl shadow-[#4f46e5]/15"
            : "border-slate-200/60"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`${FONT_STYLES.topicTitle} flex-1 pr-2 text-sm leading-tight transition-colors group-hover:text-[#4f46e5] lg:text-[13px] ${
              isSelected
                ? "text-[#4f46e5]"
                : "text-slate-700"
            }`}
          >
            {cardInfo.title}
          </h4>

          {isCompleted && (
            <div className="absolute -right-3 -top-3">
              <div className="h-6 w-6 rounded-full bg-white/70 p-[2px] shadow-sm sm:h-7 sm:w-7">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#2E9E44]">
                  <Check
                    size={12}
                    className="stroke-[3] text-white sm:h-[14px] sm:w-[14px]"
                  />
                </div>
              </div>
            </div>
          )}

          {isDue ? (
            <span
              className={`${FONT_STYLES.topicStatus} flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600`}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              {intl.formatMessage({
                id: "watch.review",
              })}
            </span>
          ) : (
            <span
              className={`px-2 py-0.5 text-[10px] ${FONT_STYLES.topicStatus}`}
            >
              &nbsp;
            </span>
          )}

          <span
            className={`${FONT_STYLES.topicStatus} shrink-0 rounded-full bg-slate-100 px-2 py-1 font-bold text-slate-400 transition-colors group-hover:text-slate-600`}
          >
            {formatVideoTime(cardInfo.start_time)}
          </span>
        </div>

        <p
          className={`${FONT_STYLES.topicDescription} mb-1.5 mt-1.5 line-clamp-2 text-[11px] text-slate-400 group-hover:text-slate-500 lg:text-[10px]`}
        >
          {cardInfo.main_topic}
        </p>

        <div className="mt-2 grid grid-cols-4 gap-2">
          <ContentGenerationBtn
            onClick={() => {}}
            icon={<TvMinimalPlay size={18} />}
            label={intl.formatMessage({
              id: "watch.content.watch",
            })}
          />

          <ContentGenerationBtn
            onClick={() => setIsSummaryModalOpen(true)}
            icon={<NotebookText size={18} />}
            label={intl.formatMessage({
              id: "watch.content.summary",
            })}
          />

          <ContentGenerationBtn
            onClick={handleQuizClick}
            icon={<FileQuestion size={18} />}
            label={intl.formatMessage({
              id: "watch.content.quiz",
            })}
          />

          <ContentGenerationBtn
            onClick={() =>
              navigate(
                `${AppRoutesNames.watchVideo}/${AppRoutesNames.flashCards}/${cardInfo.segment_id}`,
              )
            }
            icon={<Layers size={18} />}
            label={intl.formatMessage({
              id: "watch.content.cards",
            })}
            isDue={isDue}
          />
        </div>
      </div>

      <QuizDifficultyModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelect={(difficulty) => {
          setIsQuizModalOpen(false);

          const quizKey = `${cardInfo.segment_id}_${difficulty}_${Date.now()}`;

          localStorage.setItem(
            `active_quiz_key_${cardInfo.segment_id}`,
            quizKey,
          );

          navigate(
            `${AppRoutesNames.quiz}/${cardInfo.segment_id}`,
            {
              state: {
                difficulty,
                videoId,
                segmentId: cardInfo.segment_id,
                quizKey,
              },
            },
          );
        }}
      />

      <SummaryStyleModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onSelect={handleSummarySelect}
      />
    </>
  );
}