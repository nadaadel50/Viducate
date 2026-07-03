import { useState } from "react";
import { useNavigate } from "react-router";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

const QUIZ_KEY = (videoId: number) => `active_quiz_key_video_${videoId}`;

export function useRightContentSection() {
  const navigate = useNavigate();

  const { selectedTopic, toggleTopicComplete, goToNextTopic, videoId } =
    useLearningSession();

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const handleFinalQuizClick = () => {
    const savedKey = localStorage.getItem(QUIZ_KEY(videoId!));

    if (savedKey) {
      navigate(`${AppRoutesNames.quizByVideo}/${videoId}`, {
        state: {
          videoId,
          segmentId: null,
          quizKey: savedKey,
        },
      });
      return;
    }

    setIsQuizModalOpen(true);
  };

  const handleFinalQuizSelect = (difficulty: "easy" | "medium" | "hard") => {
    setIsQuizModalOpen(false);

    const quizKey = `video_${videoId}_${difficulty}_${Date.now()}`;

    localStorage.setItem(QUIZ_KEY(videoId!), quizKey);

    navigate(`${AppRoutesNames.quizByVideo}/${videoId}`, {
      state: {
        difficulty,
        videoId,
        segmentId: null,
        quizKey,
      },
    });
  };

  const handleSummarySelect = (style: "summary" | "study_notes") => {
    const path =
      style === "summary"
        ? `${AppRoutesNames.summaryByVideo}/${videoId}`
        : `${AppRoutesNames.studyNotesByVideo}/${videoId}`;

    navigate(path, {
      state: {
        videoId,
      },
    });
  };

  const handleCompleteClick = () => {
    if (selectedTopic) {
      toggleTopicComplete(selectedTopic.segment_id);
    }
  };

  return {
    videoId,
    isQuizModalOpen,
    isSummaryModalOpen,
    setIsQuizModalOpen,
    setIsSummaryModalOpen,
    handleFinalQuizClick,
    handleFinalQuizSelect,
    handleSummarySelect,
    handleCompleteClick,
    goToNextTopic,
  };
}
