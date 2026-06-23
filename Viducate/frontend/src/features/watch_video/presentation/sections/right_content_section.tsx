import {
  ArrowRight,
  CircleCheckBig,
  FileQuestion,
  FileText,
  Brain,
} from "lucide-react";
import { VideoPlayer } from "./video_part";
import { TranscriptSearch } from "../widgets/transcript_search";
import { FinalGeneratedBtn } from "../widgets/final_generated_btn";
import { MainHeader } from "../widgets/main_header";
import { ChatBotOpenBtn } from "../../../chat_bot/presenation/widgets/chat_bot_open_btn";
import { useNavigate } from "react-router";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { SummaryStyleModal } from "../../../summarization/presentation/componants/SummaryStyleModal";
import { useState } from "react";
import { QuizDifficultyModal } from "../../../QuizSystem/presentation/componants/QuizDifficultyModal";
export function RightContentSection() {
  const navigate = useNavigate();
  const { selectedTopic, toggleTopicComplete, goToNextTopic, videoId } =
    useLearningSession();
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  

  const handleSummarySelect = (style: "summary" | "study_notes") => {
    if (style === "summary") {
      navigate(`/summary/video/${videoId}`, {
        state: { videoId },
      });
    } else {
      navigate(`/study-notes/video/${videoId}`, {
        state: { videoId },
      });
    }
  };

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const handleFinalQuizSelect = (difficulty: "easy" | "medium" | "hard") => {
    setIsQuizModalOpen(false);
    const quizKey = `video_${videoId}_${difficulty}_${Date.now()}`;
    localStorage.setItem(`active_quiz_key_video_${videoId}`, quizKey);

    navigate(`/quiz/video/${videoId}`, {
      state: {
        difficulty,
        videoId,
        segmentId: null,
        quizKey,
      },
    });
  };
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      {/* centered container */}
      <div className="w-full max-w-5xl px-8 ">
        {/* 🔹 HEADER (aligned with content start) */}
        <MainHeader />

        {/* 🔹 CONTENT */}
        <div className="flex-1 pb-10">
          {/* video */}
          <div className="mt-6">
            <VideoPlayer />
          </div>

          {/* search */}
          <div className="mt-8">
            <TranscriptSearch />
          </div>

          {/* actions */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                if (selectedTopic)
                  toggleTopicComplete(selectedTopic.segment_id);
              }}
              className="cursor-pointer flex-1 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#4f46e5]/50 hover:bg-slate-50 hover:text-[#4f46e5] transition"
            >
              <CircleCheckBig size={20} />
              Complete Topic
            </button>

            <button
              onClick={goToNextTopic}
              className="cursor-pointer flex-1 flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 transition"
            >
              Next Topic
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* 🔹 FOOTER */}
      </div>
      <div className="w-full border-t border-slate-200 bg-white/80 backdrop-blur p-4 sticky bottom-0 ">
        <div className="grid grid-cols-2 gap-3">
          <FinalGeneratedBtn
            variant="quiz"
            icon={<FileQuestion size={20} />}
            label="Final Quiz"
            onClick={() => {
              const savedKey = localStorage.getItem(
                `active_quiz_key_video_${videoId}`,
              );
              if (savedKey) {
                navigate(`/quiz/video/${videoId}`, {
                  state: { videoId, segmentId: null, quizKey: savedKey },
                });
              } else {
                setIsQuizModalOpen(true);
              }
            }}
          />
          <FinalGeneratedBtn
            variant="summary"
            icon={<FileText size={20} />}
            label="Final Summary"
            onClick={() => setIsSummaryModalOpen(true)}
          />
          <FinalGeneratedBtn
            variant="flashcards"
            icon={<FileQuestion size={20} />}
            label="Final Flashcards"
            onClick={() => {
              navigate("flashcards")
            }}
          />
          <FinalGeneratedBtn
            variant="mindmap"
            icon={<Brain size={20} />}
            label="Final Mind Map"
            onClick={() => {
              navigate(AppRoutesNames.mindMap);
            }}
          />
        </div>
      </div>
      <ChatBotOpenBtn />
      <SummaryStyleModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onSelect={handleSummarySelect}
      />
      <QuizDifficultyModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelect={handleFinalQuizSelect}
      />
    </div>
  );
}
