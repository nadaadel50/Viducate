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
import { QuizDifficultyModal } from "../componants/QuizDifficultyModal";
import { useEffect, useRef, useState } from "react";

const SECONDS_PER_QUESTION: Record<"easy" | "medium" | "hard", number> = {
  easy: 30,
  medium: 50,
  hard: 75,
};

const calcTime = (
  totalQuestions: number,
  difficulty: "easy" | "medium" | "hard",
) => (totalQuestions * SECONDS_PER_QUESTION[difficulty]) / 60;

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

  const {
    quiz,
    isPending,
    generate,
    submitQuiz,
    getSubmitResult,
    isSubmitting,
  } = useGenerateQuiz({
    videoId,
    segmentId,
    mode: segmentId ? "segment" : "video",
    difficulty,
  });
  const generateRef = useRef(generate);
  useEffect(() => {
    generateRef.current = generate;
  }, [generate]);
  const savedQuiz = activeQuizKey
    ? localStorage.getItem(`quiz_data_${activeQuizKey}`)
    : null;
  const localQuiz = savedQuiz ? JSON.parse(savedQuiz) : null;
  const finalQuiz = localQuiz || quiz;
  const questions = finalQuiz?.questions ?? [];
  const isArabic = finalQuiz?.language === "ar";
  const calculatedTime = finalQuiz
    ? calcTime(finalQuiz.total_questions ?? questions.length, difficulty)
    : 0;

  const submitResult = getSubmitResult(finalQuiz?.quiz_id);

  useEffect(() => {
    if (quiz && activeQuizKey) {
      localStorage.setItem(`quiz_data_${activeQuizKey}`, JSON.stringify(quiz));
    }
  }, [quiz, activeQuizKey]);

  const answersRef = useRef<Record<string, string>>({});

  const handleSubmit = () => {
    if (finalQuiz) {
      submitQuiz(finalQuiz.quiz_id, answersRef.current, questions);
    }
  };

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
    isAllAnswered,
    resetQuiz,
    progress,
  } = useQuiz(questions, calculatedTime, activeQuizKey ?? "", handleSubmit);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  const handleSelectDifficulty = (
    newDifficulty: "easy" | "medium" | "hard",
  ) => {
    setIsDifficultyModalOpen(false);
    if (activeQuizKey) resetQuiz();
    if (finalQuiz?.quiz_id) {
      localStorage.removeItem(`quiz_submit_${finalQuiz.quiz_id}`);
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
    if (!hasLocal) generateRef.current();
  }, [activeQuizKey]);
  if (!activeQuizKey || isDifficultyModalOpen) {
    return (
      <QuizDifficultyModal
        isOpen={isDifficultyModalOpen}
        onClose={() => {
          if (!activeQuizKey) navigate(-1);
          else setIsDifficultyModalOpen(false);
        }}
        onSelect={handleSelectDifficulty}
      />
    );
  }

  if (isPending && !finalQuiz)
    return (
      <GenerationLoadingScreen
        icon={<FileQuestion />}
        titlePrefix="AI is Synthesizing"
        titleHighlight="your quiz..."
        subtitle="Crafting questions and answers based on the video content"
      />
    );
  if (!finalQuiz) return  <GenerationLoadingScreen
        icon={<FileQuestion />}
        titlePrefix="AI is Synthesizing"
        titleHighlight="your quiz..."
        subtitle="Crafting questions and answers based on the video content"
      />

  const currentSubmitQuestion = submitResult?.questions.find(
    (q) => q.questionId === currentQuestion?.question_id,
  );

  return (
    <main
      className="min-h-screen py-10 relative"
      style={{ background: COLORS.background.light }}
    >
      {/* Result Card */}
      {quizState === "results" &&
        !isReviewMode &&
        (isSubmitting ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/10">
            <p className="text-white font-bold text-xl animate-pulse">
              Submitting...
            </p>
          </div>
        ) : submitResult ? (
          <QuizResultCard
            submitResult={submitResult}
            onReview={() => {
              setIsReviewMode(true);
              setQuizState("playing");
              setCurrentIndex(0);
            }}
          />
        ) : null)}

      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div
            className="lg:col-span-8 space-y-8"
            dir={isArabic ? "rtl" : "ltr"}
          >
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
              submitQuestion={currentSubmitQuestion}
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
                if (currentIndex === questions.length - 1 && !isReviewMode) {
                  handleSubmit();
                  setQuizState("results");
                } else if (currentIndex < questions.length - 1) {
                  setCurrentIndex((prev) => prev + 1);
                }
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
