
import { useState, useEffect } from 'react';

export const useQuiz = (questions: any[], initialTime: number, onNewQuiz: () => void) => {

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('quiz_index');
    return saved ? parseInt(saved) : 0;
  });

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('quiz_answers');
    return saved ? JSON.parse(saved) : {};
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('quiz_time');
    return saved ? parseInt(saved) : initialTime * 60;
  });


  const [quizState, setQuizState] = useState<'playing' | 'results'>(() => {
    const saved = localStorage.getItem('quiz_state');
    return (saved as 'playing' | 'results') || 'playing';
  });


  const [isReviewMode, setIsReviewMode] = useState(() => {
    const saved = localStorage.getItem('quiz_isReview');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('quiz_index', currentIndex.toString());
    localStorage.setItem('quiz_answers', JSON.stringify(answers));
    localStorage.setItem('quiz_time', timeLeft.toString());
    localStorage.setItem('quiz_state', quizState);
    localStorage.setItem('quiz_isReview', isReviewMode.toString());
  }, [currentIndex, answers, timeLeft, quizState, isReviewMode]);

  useEffect(() => {
    if (quizState !== 'playing' || isReviewMode || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizState, isReviewMode, timeLeft]);

  
  useEffect(() => {
    if (timeLeft === 0 && !isReviewMode && quizState === 'playing') {
      setQuizState('results');
    }
  }, [timeLeft, isReviewMode, quizState]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionId: string) => {
    if (isReviewMode || quizState === 'results') return; 
    setAnswers(prev => ({ ...prev, [currentQuestion.question_id]: optionId }));
  };

  const resetQuiz = () => {
    localStorage.clear();
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(initialTime * 60);
    setQuizState('playing');
    setIsReviewMode(false);
    onNewQuiz();
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) score++;
    });
    const percentage = Math.round((score / questions.length) * 100);
    return { score, total: questions.length, percentage };
  };

  
const isAllAnswered = questions.every(q => answers[q.question_id] !== undefined);
  return {
    currentIndex, setCurrentIndex,
    currentQuestion, answers,
    handleSelect, timeLeft,
    quizState, setQuizState,
    isReviewMode, setIsReviewMode,
    calculateScore, isAllAnswered,
    resetQuiz,
    progress: ((currentIndex + 1) / questions.length) * 100
  };
};