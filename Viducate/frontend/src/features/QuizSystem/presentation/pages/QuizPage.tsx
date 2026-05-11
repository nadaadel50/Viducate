import { useLocation, useNavigate } from 'react-router';
import { QuizProgressBar } from '../componants/QuizProgressBar';
import { QuizOptions } from '../componants/QuizOptions';
import { QuestionMap } from '../componants/QuestionMap';
import { QuizResultCard } from '../componants/QuizResultCard';
import { QuizTimer } from '../componants/QuizTimer';
import { QuizActions } from '../componants/QuizActions';
import { COLORS } from '../../../../core/constants';
import { useQuiz } from '../hooks/useQuiz';
import { useGenerateQuiz } from '../hooks/useGenerateQuiz';
import { GeneratingQuizPage } from './GeneratingQuizPage';
import { useEffect  } from 'react';
export const QuizPage = () => {
  const { state } = useLocation();
  const quizKey =
  state?.quizKey ||
  localStorage.getItem('active_quiz_key') ||
  '';
  const navigate = useNavigate();

  const { difficulty, videoId, segmentId } = state;

  const { quiz, isPending , generate } = useGenerateQuiz({
    videoId,
    segmentId,
    mode: segmentId ? 'segment' : 'video',
    difficulty,
  });
  const savedQuiz = localStorage.getItem(`quiz_data_${quizKey}`);

const localQuiz = savedQuiz ? JSON.parse(savedQuiz) : null;
const finalQuiz = localQuiz || quiz;
const questions = finalQuiz?.questions ?? [];
useEffect(() => {
  if (!localQuiz) {
    generate();
  }
}, []);
useEffect(() => {
  if (quiz) {
    localStorage.setItem(
      `quiz_data_${quizKey}`,
      JSON.stringify(quiz)
    );
  }
}, [quiz, quizKey]);
  const {
    currentIndex, setCurrentIndex, currentQuestion,
    answers, handleSelect, timeLeft, quizState,
    setQuizState, isReviewMode, setIsReviewMode,
    calculateScore, progress, isAllAnswered, resetQuiz,
  } = useQuiz( questions, segmentId ? 5 : 15, () => navigate(-1),quizKey);

  if (isPending || !finalQuiz) return <GeneratingQuizPage />;



  const stats = calculateScore();
  

  return (
    <main className="min-h-screen py-10 relative" style={{ background: COLORS.background.light }}>
      {quizState === 'results' && (
        <QuizResultCard
          stats={stats}
          onTakeAnother={resetQuiz}
          onReview={() => {
            setIsReviewMode(true);
            setQuizState('playing');
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
                if (currentIndex === questions.length - 1 && !isReviewMode) setQuizState('results');
                else if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
              }}
              onBackToVideo={() => navigate(-1)}
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
    </main>
  );
};
