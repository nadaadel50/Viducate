import {
  ArrowRight,
  CircleCheckBig,
  FileQuestion,
  FileText,
  Brain,
  PanelRightOpen,
} from "lucide-react";
import { VideoPlayer } from "./video_part";
import { TranscriptSearch } from "../widgets/transcript_search";
import { FinalGeneratedBtn } from "../widgets/final_generated_btn";
import { MainHeader } from "../widgets/main_header";
import { ChatBotOpenBtn } from "../../../chat_bot/presenation/widgets/chat_bot_open_btn";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { SummaryStyleModal } from "../../../summarization/presentation/componants/SummaryStyleModal";
import { QuizDifficultyModal } from "../../../QuizSystem/presentation/componants/QuizDifficultyModal";
import { useNavigate } from "react-router";
import { useRightContentSection } from "../hook/use_right_content_section";
import { CustomButton } from "../../../../core/componants/custum_btn";
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

  const footerActions = [
    {
      variant: "quiz",
      icon: <FileQuestion size={20} />,
      label: "Final Quiz",
      onClick: handleFinalQuizClick,
    },
    {
      variant: "summary",
      icon: <FileText size={20} />,
      label: "Final Summary",
      onClick: () => setIsSummaryModalOpen(true),
    },
    {
      variant: "flashcards",
      icon: <FileQuestion size={20} />,
      label: "Final Flashcards",
      onClick: () => navigate("flashcards"),
    },
    {
      variant: "mindmap",
      icon: <Brain size={20} />,
      label: "Final Mind Map",
      onClick: () => navigate(AppRoutesNames.mindMap),
    },
  ] as const;

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <div className="w-full max-w-5xl px-8">
        <button onClick={onOpenTopics} className="lg:hidden">
          <PanelRightOpen size={22} />
        </button>

        <MainHeader />

        <div className="flex-1 pb-10">
          <div className="mt-6">
            <VideoPlayer />
          </div>
          <div className="mt-8">
            <TranscriptSearch />
          </div>

          <div className="mt-8 flex gap-3">
            <CustomButton
              fullWidth
              leftIcon={<CircleCheckBig size={20} />}
              onClick={handleCompleteClick}
              className="border border-slate-200 bg-white text-slate-700 hover:border-[#4f46e5]/50 hover:bg-slate-50 hover:text-[#4f46e5]"
            >
              Complete Topic
            </CustomButton>
            <CustomButton
              fullWidth
              rightIcon={<ArrowRight size={20} />}
              onClick={goToNextTopic}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Next Topic
            </CustomButton>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-200 bg-white/80 backdrop-blur p-4 sticky bottom-0">
        <div className="grid grid-cols-2 gap-3">
          {footerActions.map(({ variant, icon, label, onClick }) => (
            <FinalGeneratedBtn
              key={variant}
              variant={variant}
              icon={icon}
              label={label}
              onClick={onClick}
            />
          ))}
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
