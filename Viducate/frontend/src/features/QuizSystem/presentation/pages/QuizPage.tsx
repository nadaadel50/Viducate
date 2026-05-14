import { useLocation, useNavigate } from "react-router";
import { QuizProgressBar } from "../componants/QuizProgressBar";
import { QuizOptions } from "../componants/QuizOptions";
import { QuestionMap } from "../componants/QuestionMap";
import { QuizResultCard } from "../componants/QuizResultCard";
import { QuizTimer } from "../componants/QuizTimer";
import { QuizActions } from "../componants/QuizActions";
import { COLORS } from "../../../../core/constants";
import { useQuiz } from "../hooks/useQuiz";
import { useGenerateQuiz } from "../hooks/useGenerateQuiz";
import { GeneratingQuizPage } from "./GeneratingQuizPage";
import { QuizDifficultyModal } from "../componants/QuizDifficultyModal";
import { useEffect, useState } from "react";

export const QuizPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { videoId, segmentId } = state;

  const savedKey = localStorage.getItem(`active_quiz_key_${segmentId}`);

  const [activeQuizKey, setActiveQuizKey] = useState<string | null>(
    savedKey || null,
  );

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    state?.difficulty ?? "medium",
  );

  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(!savedKey);

  const { quiz, isPending, generate } = useGenerateQuiz({
    videoId,
    segmentId,
    mode: segmentId ? "segment" : "video",
    difficulty,
  });

  const savedQuiz = activeQuizKey
    ? localStorage.getItem(`quiz_data_${activeQuizKey}`)
    : null;
  const localQuiz = savedQuiz ? JSON.parse(savedQuiz) : null;
  const finalQuiz = localQuiz || quiz;
  const questions = finalQuiz?.questions ?? [];

  useEffect(() => {
    if (quiz && activeQuizKey) {
      localStorage.setItem(`quiz_data_${activeQuizKey}`, JSON.stringify(quiz));
    }
  }, [quiz, activeQuizKey]);

  const {
    currentIndex,
    setCurrentIndex,
    currentQuestion,
    answers,
    handleSelect,
    timeLeft,
    quizState,
    setQuizState,
    isReviewMode,
    setIsReviewMode,
    calculateScore,
    progress,
    isAllAnswered,
    resetQuiz,
  } = useQuiz(questions, segmentId ? 5 : 15, activeQuizKey ?? "");


  const handleSelectDifficulty = (
    newDifficulty: "easy" | "medium" | "hard",
  ) => {
    setIsDifficultyModalOpen(false);


    if (activeQuizKey) {
      resetQuiz();
    }


    const newQuizKey = `${segmentId}_${newDifficulty}_${Date.now()}`;
    localStorage.setItem(`active_quiz_key_${segmentId}`, newQuizKey);

    setDifficulty(newDifficulty);
    setActiveQuizKey(newQuizKey);

  
    generate();
  };

  useEffect(() => {
    if (!activeQuizKey) return;
    const hasLocal = !!localStorage.getItem(`quiz_data_${activeQuizKey}`);

    if (!hasLocal) {
      generate();
    }
  }, [activeQuizKey]);
  if (!activeQuizKey || isDifficultyModalOpen) {
    return (
      <>
        <QuizDifficultyModal
          isOpen={isDifficultyModalOpen}
          onClose={() => {

            if (!activeQuizKey) navigate(-1);
            else setIsDifficultyModalOpen(false);
          }}
          onSelect={handleSelectDifficulty}
        />
      </>
    );
  }

  if (isPending && !finalQuiz) return <GeneratingQuizPage />;
  if (!finalQuiz) return <GeneratingQuizPage />;

  const stats = calculateScore();

  return (
    <main
      className="min-h-screen py-10 relative "
      style={{ background: COLORS.background.light }}
    >

      {quizState === "results" && (
        <QuizResultCard
          stats={stats}
          onReview={() => {
            setIsReviewMode(true);
            setQuizState("playing");
            setCurrentIndex(0);
          }}
        />
      )}

      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-8 space-y-8">
            <QuizProgressBar
              current={currentIndex + 1}
              total={questions.length}
              percentage={progress}
            />
            <QuizOptions
              question={currentQuestion}
              selectedId={answers[currentQuestion?.question_id]}
              onSelect={handleSelect}
              isReviewMode={isReviewMode}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <QuizTimer timeLeft={timeLeft} />
            <QuizActions
              isFirst={currentIndex === 0}
              isLast={currentIndex === questions.length - 1}
              isReviewMode={isReviewMode}
              canSubmit={isAllAnswered}
              onPrevious={() => setCurrentIndex((prev) => prev - 1)}
              onNext={() => {
                if (currentIndex === questions.length - 1 && !isReviewMode)
                  setQuizState("results");
                else if (currentIndex < questions.length - 1)
                  setCurrentIndex((prev) => prev + 1);
              }}
              onNewQuiz={() => setIsDifficultyModalOpen(true)}
            />
            <QuestionMap
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              onNavigate={setCurrentIndex}
            />
          </div>
        </div>
      </div>

      <QuizDifficultyModal
        isOpen={isDifficultyModalOpen}
        onClose={() => setIsDifficultyModalOpen(false)}
        onSelect={handleSelectDifficulty}
      />
    </main>
  );
};
