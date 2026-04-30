import { useQuiz } from '../hooks/useQuiz';
import { QuizProgressBar } from '../componants/QuizProgressBar';
import { QuizOptions } from '../componants/QuizOptions';
import { QuestionMap } from '../componants/QuestionMap';
import { QuizResultCard } from '../componants/QuizResultCard';
import { QuizTimer } from '../componants/QuizTimer';
import { QuizActions } from '../componants/QuizActions';

const MOCK_QUESTIONS = [
  {
    id: '1',
    text: "What is the primary function of the amygdala?",
    options: [
      { id: 'a', text: 'Processing memory, decision-making and emotional responses.' },
      { id: 'b', text: 'Regulating body temperature and hunger' },
      { id: 'c', text: 'Controlling motor function and balance.' },
      { id: 'd', text: 'Processing visual information from the eyes.' }
    ],
    correctOptionId: 'a'
  },
  {
    id: '2',
    text: "Which part of the brain processes vision?",
    options: [
      { id: 'a', text: 'Frontal lobe' },
      { id: 'b', text: 'Parietal lobe' },
      { id: 'c', text: 'Temporal lobe' },
      { id: 'd', text: 'Occipital lobe' }
    ],
    correctOptionId: 'd'
  },
  {
    id: '3',
    text: "What is the largest organ in the human body?",
    options: [
      { id: 'a', text: 'Heart' },
      { id: 'b', text: 'Skin' },
      { id: 'c', text: 'Liver' },
      { id: 'd', text: 'Brain' }
    ],
    correctOptionId: 'b'
  },
  {
    id: '4',
    text: "What is the basic unit of the brain?",
    options: [
      { id: 'a', text: 'Neuron' },
      { id: 'b', text: 'Synapse' },
      { id: 'c', text: 'Glial cell' },
      { id: 'd', text: 'Axon' }
    ],
    correctOptionId: 'a'
  },
  {
    id: '5',
    text: "Which neurotransmitter is linked to reward?",
    options: [
      { id: 'a', text: 'Serotonin' },
      { id: 'b', text: 'Dopamine' },
      { id: 'c', text: 'GABA' },
      { id: 'd', text: 'Acetylcholine' }
    ],
    correctOptionId: 'b'
  }
];

export const QuizPage = () => {
  const {
    currentIndex, setCurrentIndex, currentQuestion,
    answers, handleSelect, timeLeft, quizState,
    setQuizState, isReviewMode, startReview,
    resetQuiz, calculateScore, progress
  } = useQuiz(MOCK_QUESTIONS, 15);

  // RESULT OVERLAY
  if (quizState === 'results') {
    const stats = calculateScore();
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <QuizResultCard 
            percentage={stats.percentage}
            score={stats.score}
            total={stats.total}
            onRetry={resetQuiz}
            onReview={startReview}
          />
        </div>
      </div>
    );
  }

  return (
  <main className="min-h-screen bg-[#f5f7fb] py-10">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-4">

            <QuizProgressBar 
              current={currentIndex + 1}
              total={MOCK_QUESTIONS.length}
              percentage={progress}
            />

            <QuizOptions 
              question={currentQuestion}
              selectedId={answers[currentQuestion.id]}
              onSelect={handleSelect}
              isReviewMode={isReviewMode}
            />

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-4">

            <QuizTimer timeLeft={timeLeft} />

            <QuizActions 
  isFirst={currentIndex === 0}
  isLast={currentIndex === MOCK_QUESTIONS.length - 1}
  isReviewMode={isReviewMode}
  disabledNext={!answers[currentQuestion.id]}

  onPrevious={() => setCurrentIndex(prev => prev - 1)}

  onNext={() => {
    if (currentIndex === MOCK_QUESTIONS.length - 1) {
      setQuizState('results');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }}

  onReset={resetQuiz}
/>

            <QuestionMap 
              questions={MOCK_QUESTIONS}
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