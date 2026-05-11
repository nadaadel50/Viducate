
// import { QuizProgressBar } from '../componants/QuizProgressBar';
// import { QuizOptions } from '../componants/QuizOptions';
// import { QuestionMap } from '../componants/QuestionMap';
// import { QuizResultCard } from '../componants/QuizResultCard';
// import { QuizTimer } from '../componants/QuizTimer';
// import { QuizActions } from '../componants/QuizActions';
// import { COLORS } from "../../../../core/constants";
// import { useQuiz } from '../hooks/useQuiz';

// const MOCK_QUESTIONS = [
//   {
//     question_id: 1,
//     question_text: "What is the primary function of the amygdala?",
//     choices: {
//       a: "Processing memory and emotional responses.",
//       b: "Regulating body temperature.",
//       c: "Controlling motor function.",
//       d: "Processing visual information."
//     },
//     correct_answer: "a",
//     video_timestamp: 135,
//     timestamp_label: "02:15"
//   },
//   {
//     question_id: 2,
//     question_text: "Which part of the brain processes vision?",
//     choices: {
//       a: "Frontal lobe",
//       b: "Parietal lobe",
//       c: "Temporal lobe",
//       d: "Occipital lobe"
//     },
//     correct_answer: "d",
//     video_timestamp: 450,
//     timestamp_label: "07:30"
//   }
// ];

// export const QuizPage = () => {
//   const {
//     currentIndex, setCurrentIndex, currentQuestion,
//     answers, handleSelect, timeLeft, quizState,
//     setQuizState, isReviewMode, setIsReviewMode,
//     calculateScore, progress, isAllAnswered, resetQuiz
//   } = useQuiz(MOCK_QUESTIONS, 15, () => console.log("New Quiz"));

//   const stats = calculateScore();

//   return (
//     <main className="min-h-screen py-10 relative" style={{ background: COLORS.background.light }}>
      
//       {quizState === 'results' && (
//         <QuizResultCard 
//           stats={stats} 
//           onTakeAnother={resetQuiz}
//           onReview={() => { setIsReviewMode(true); setQuizState('playing'); setCurrentIndex(0); }}
//         />
//       )}

//       <div className="w-full max-w-7xl mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

//           {/* {left side: Progress + question and options} */}
//           <div className="lg:col-span-8 space-y-8">
//             <QuizProgressBar 
//                current={currentIndex + 1} 
//                total={MOCK_QUESTIONS.length} 
//                percentage={progress} 
//             />
            
  
//             <QuizOptions 
//               question={currentQuestion} 
              
//               selectedId={answers[currentQuestion.question_id]} 
//               onSelect={handleSelect} 
//               isReviewMode={isReviewMode} 
//             />
//           </div>

//           {/* right side: timer and actions */}
//           <div className="lg:col-span-4 space-y-4">
//             <QuizTimer timeLeft={timeLeft} />
//             <QuizActions 
//               isFirst={currentIndex === 0}
//               isLast={currentIndex === MOCK_QUESTIONS.length - 1}
//               isReviewMode={isReviewMode}
//               canSubmit={isAllAnswered}
//               onPrevious={() => setCurrentIndex(prev => prev - 1)}
//               onNext={() => {
//                 if (currentIndex === MOCK_QUESTIONS.length - 1 && !isReviewMode) setQuizState('results');
//                 else if (currentIndex < MOCK_QUESTIONS.length - 1) setCurrentIndex(prev => prev + 1);
//               }}
//               onBackToVideo={() => console.log("Back")}
//             />
//             <QuestionMap 
//               questions={MOCK_QUESTIONS} 
//               currentIndex={currentIndex} 
//               answers={answers} 
//               onNavigate={setCurrentIndex} 
//             />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };
import { QuizProgressBar } from '../componants/QuizProgressBar';
import { QuizOptions } from '../componants/QuizOptions';
import { QuestionMap } from '../componants/QuestionMap';
import { QuizResultCard } from '../componants/QuizResultCard';
import { QuizTimer } from '../componants/QuizTimer';
import { QuizActions } from '../componants/QuizActions';
import { COLORS } from '../../../../core/constants';
import { useQuiz } from '../hooks/useQuiz';
import { QuizQuestionEntity } from '../../domain/entity/quiz_entity';


interface QuizPageProps {
  questions: QuizQuestionEntity[];
  onNewQuiz: () => void;
  initialTime: number;
}

export const QuizPage = ({ questions, onNewQuiz, initialTime }: QuizPageProps) => {
  const {
    currentIndex, setCurrentIndex, currentQuestion,
    answers, handleSelect, timeLeft, quizState,
    setQuizState, isReviewMode, setIsReviewMode,
    calculateScore, progress, isAllAnswered, resetQuiz,
  } = useQuiz(questions, initialTime, onNewQuiz);

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
              onBackToVideo={() => console.log('Back to video')}
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