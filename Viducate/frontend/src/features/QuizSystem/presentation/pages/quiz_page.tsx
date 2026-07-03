import { FileQuestion } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { COLORS } from "../../../../core/constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

import { GenerationLoadingScreen } from "../../../../core/componants/generation_loading_screen";

import { QuizActions } from "../componants/quiz_actions";
import { QuizDifficultyModal } from "../componants/quiz_difficulty_modal";
import { QuizOptions } from "../componants/quiz_options";
import { QuizProgressBar } from "../componants/quiz_progress_bar";
import { QuestionMap } from "../componants/question_map";
import { QuizResultCard } from "../componants/quiz_result_card";
import { QuizTimer } from "../componants/quiz_timer";
import { useQuizPage } from "../hooks/use_quiz_page";
import { CustumError } from "../../../../core/componants/custum_error";
import ErrorScreen from "../../../../core/componants/error_screen";

export function QuizPage() {
  const {
    intl,

    isPending,
    isSubmitting,

    activeQuizKey,
    isDifficultyModalOpen,

    finalQuiz,
    questions,
    isArabic,

    currentQuestion,
    currentIndex,
    currentSubmitQuestion,

    answers,
    progress,
    timeLeft,

    quizState,
    isReviewMode,
    isAllAnswered,

    submitResult,

    handleSelect,
    handleNext,
    handlePrevious,
    handleReview,

    handleCloseDifficultyModal,
    handleSelectDifficulty,

    setCurrentIndex,
    setIsDifficultyModalOpen,
    isError,
    generateQuizError,
    submitError,
  } = useQuizPage();

  if(isError) {
    return(
      <ErrorScreen errorMessage={generateQuizError} />
    )
  }

  if (!activeQuizKey || isDifficultyModalOpen) {
    return (
      <QuizDifficultyModal
        isOpen={isDifficultyModalOpen}
        onClose={handleCloseDifficultyModal}
        onSelect={handleSelectDifficulty}
      />
    );
  }

  if (isPending && !finalQuiz) {
    return (
      <GenerationLoadingScreen
        icon={<FileQuestion />}
        titlePrefix={intl.formatMessage({
          id: "quiz.loading.titlePrefix",
        })}
        titleHighlight={intl.formatMessage({
          id: "quiz.loading.titleHighlight",
        })}
        subtitle={intl.formatMessage({
          id: "quiz.loading.subtitle",
        })}
      />
    );
  }

  if (!finalQuiz) {
    return (
      <GenerationLoadingScreen
        icon={<FileQuestion />}
        titlePrefix={intl.formatMessage({
          id: "quiz.loading.titlePrefix",
        })}
        titleHighlight={intl.formatMessage({
          id: "quiz.loading.titleHighlight",
        })}
        subtitle={intl.formatMessage({
          id: "quiz.loading.subtitle",
        })}
      />
    );
  }

  return (
    <main
      className="relative min-h-screen py-6 md:py-8 lg:py-10 font-display"
      style={{ background: COLORS.background.radialGradient }}
    >
      {quizState === "results" &&
        !isReviewMode &&
        (isSubmitting ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-md">
            <p
              className={`animate-pulse text-white ${FONT_SIZE.size20} ${FONT_WEIGHT.bold}`}
            >
              <FormattedMessage id="quiz.submitting" />
            </p>
          </div>
        ) : submitResult ? (
          <QuizResultCard submitResult={submitResult} onReview={handleReview} />
        ) : submitError ? (
          <div className="text-red-500"> {submitError} </div>
        ) : null)}

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="lg:hidden mb-2">
          <QuizTimer timeLeft={timeLeft} compact />
        </div>
        <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-12 lg:gap-10">
          <section
            className="space-y-5 md:space-y-6 lg:col-span-8 lg:space-y-8"
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
          </section>

          <aside className="space-y-4 lg:col-span-4">
            <div className="hidden lg:block">
              <QuizTimer timeLeft={timeLeft} />
            </div>

            <QuizActions
              isFirst={currentIndex === 0}
              isLast={currentIndex === questions.length - 1}
              isReviewMode={isReviewMode}
              canSubmit={isAllAnswered}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onNewQuiz={() => setIsDifficultyModalOpen(true)}
            />

            <QuestionMap
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              onNavigate={setCurrentIndex}
            />
          </aside>
        </div>
      </div>

      <QuizDifficultyModal
        isOpen={isDifficultyModalOpen}
        onClose={handleCloseDifficultyModal}
        onSelect={handleSelectDifficulty}
      />
    </main>
  );
}
