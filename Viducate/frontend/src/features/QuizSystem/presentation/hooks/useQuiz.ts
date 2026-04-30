import { useState, useEffect} from 'react';

export const useQuiz = (questions: any[], initialTime: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(initialTime * 60);
  const [quizState, setQuizState] = useState<'playing' | 'results'>('playing');
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Timer Logic
  useEffect(() => {
    if (quizState !== 'playing' || isReviewMode || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setQuizState('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, isReviewMode, timeLeft]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionId: string) => {
    if (isReviewMode) return; 
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) score++;
    });
    const percentage = Math.round((score / questions.length) * 100);
    return { score, total: questions.length, percentage };
  };

  const startReview = () => {
    setIsReviewMode(true);
    setQuizState('playing');
    setCurrentIndex(0);
  };

  const resetQuiz = () => {
    setAnswers({});
    setTimeLeft(initialTime * 60);
    setCurrentIndex(0);
    setQuizState('playing');
    setIsReviewMode(false);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return {
    currentIndex,
    setCurrentIndex,
    currentQuestion,
    answers,
    handleSelect,
    timeLeft,
    quizState,
    setQuizState,
    isReviewMode,
    startReview,
    resetQuiz,
    calculateScore,
    progress
  };
};