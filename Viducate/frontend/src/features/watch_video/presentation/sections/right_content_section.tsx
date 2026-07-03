import {
  ArrowRight,
  CircleCheckBig,
  FileQuestion,
  FileText,
  Brain,
  PanelRightOpen,
} from "lucide-react";
import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";

import { VideoPlayer } from "./video_part";
import { TranscriptSearch } from "../widgets/transcript_search";
import { FinalGeneratedBtn } from "../widgets/final_generated_btn";
import { MainHeader } from "../widgets/main_header";
import { SummaryStyleModal } from "../../../summarization/presentation/componants/summary_style_modal";
import { QuizDifficultyModal } from "../../../QuizSystem/presentation/componants/quiz_difficulty_modal";
import { CustomButton } from "../../../../core/componants/custum_btn";

import { AppRoutesNames } from "../../../../app/routers/routes";
import { useRightContentSection } from "../hook/use_right_content_section";
import { useDueFlashcards } from "../../../flash_cards/presentation/hooks/use_due_flash_cards";
import { ChatBotOpenBtn } from "../../../chat_bot/presenation/widgets/chat_bot_open_btn";

type Props = {
  onOpenTopics?: () => void;
};

export function RightContentSection({ onOpenTopics }: Props) {
  const navigate = useNavigate();

  const {
    isQuizModalOpen,
    isSummaryModalOpen,
    setIsQuizModalOpen,
    setIsSummaryModalOpen,
    handleFinalQuizClick,
    handleFinalQuizSelect,
    handleSummarySelect,
    handleCompleteClick,
    goToNextTopic,
  } = useRightContentSection();

  const { videoDueCards } = useDueFlashcards();

  const footerActions = [
    {
      variant: "quiz",
      icon: <FileQuestion size={20} />,
      labelId: "watch.actions.finalQuiz",
      onClick: handleFinalQuizClick,
      totalReviewCards: 0,
    },
    {
      variant: "summary",
      icon: <FileText size={20} />,
      labelId: "watch.actions.finalSummary",
      onClick: () => setIsSummaryModalOpen(true),
      totalReviewCards: 0,
    },
    {
      variant: "flashcards",
      icon: <FileQuestion size={20} />,
      labelId: "watch.actions.finalFlashcards",
      onClick: () =>
        navigate(`${AppRoutesNames.watchVideo}/${AppRoutesNames.flashCards}`),
      totalReviewCards: videoDueCards.length,
    },
    {
      variant: "mindmap",
      icon: <Brain size={20} />,
      labelId: "watch.actions.finalMindMap",
      onClick: () => navigate(AppRoutesNames.mindMap),
      totalReviewCards: 0,
    },
  ] as const;

  return (
    <div className="w-full flex flex-col items-center pt-6 min-h-[calc(100vh-40px)]">
      <div className="w-full max-w-5xl px-4 flex-1">
        <button
          onClick={onOpenTopics}
          className="lg:hidden my-3 block p-3 border rounded-xl border-gray-100"
        >
          <PanelRightOpen size={25} />
        </button>

        <MainHeader />

        <div className="pb-8">
          <div className="my-5">
            <VideoPlayer />
          </div>
          <div className="mt-2">
            <TranscriptSearch />
          </div>

          <div className="mt-1 flex gap-3">
            <CustomButton
              fullWidth
              leftIcon={<CircleCheckBig size={20} />}
              onClick={handleCompleteClick}
              className="border border-slate-200 bg-white text-slate-700 hover:border-[#4f46e5]/50 hover:bg-slate-50 hover:text-[#4f46e5]"
            >
              <FormattedMessage id="watch.actions.completeTopic" />
            </CustomButton>
            <CustomButton
              fullWidth
              rightIcon={<ArrowRight size={20} />}
              onClick={goToNextTopic}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              <FormattedMessage id="watch.actions.nextTopic" />
            </CustomButton>
          </div>
        </div>
      </div>

      <div className="w-full backdrop-blur ">
        <div className=" mx-auto w-full grid grid-cols-2 gap-3 border-t p-4 border-gray-100 ">
          {footerActions.map(
            ({ variant, icon, labelId, onClick, totalReviewCards }) => (
              <FinalGeneratedBtn
                key={variant}
                variant={variant}
                icon={icon}
                label={<FormattedMessage id={labelId} />}
                onClick={onClick}
                reviewCards={totalReviewCards}
              />
            ),
          )}
        </div>
      </div>
      <ChatBotOpenBtn />

      <QuizDifficultyModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelect={handleFinalQuizSelect}
      />
      <SummaryStyleModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onSelect={handleSummarySelect}
      />
    </div>
  );
}
