import { useState, useEffect } from 'react';

export const useQuiz = (questions: any[], initialTime: number, onNewQuiz: () => void, quizKey: string) => {

  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedKey = localStorage.getItem('quiz_key');
    if (savedKey !== quizKey) return 0;
    const saved = localStorage.getItem(`quiz_index_${quizKey}`);
    return saved ? parseInt(saved) : 0;
  });

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const savedKey = localStorage.getItem('quiz_key');
    if (savedKey !== quizKey) return {};
    const saved = localStorage.getItem(`quiz_answers_${quizKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedKey = localStorage.getItem('quiz_key');
    if (savedKey !== quizKey) return initialTime * 60;
    const saved = localStorage.getItem(`quiz_time_${quizKey}`);
    return saved ? parseInt(saved) : initialTime * 60;
  });

  const [quizState, setQuizState] = useState<'playing' | 'results'>(() => {
    const savedKey = localStorage.getItem('quiz_key');
    if (savedKey !== quizKey) return 'playing';
    const saved = localStorage.getItem(`quiz_state_${quizKey}`);
    return (saved as 'playing' | 'results') || 'playing';
  });

  const [isReviewMode, setIsReviewMode] = useState(() => {
    const savedKey = localStorage.getItem('quiz_key');
    if (savedKey !== quizKey) return false;
    return localStorage.getItem(`quiz_isReview_${quizKey}`) === 'true';
  });

  useEffect(() => {
    localStorage.setItem('quiz_key', quizKey);
    localStorage.setItem(`quiz_index_${quizKey}`, currentIndex.toString());
    localStorage.setItem(`quiz_answers_${quizKey}`, JSON.stringify(answers));
    localStorage.setItem(`quiz_time_${quizKey}`, timeLeft.toString());
    localStorage.setItem(`quiz_state_${quizKey}`, quizState);
    localStorage.setItem(`quiz_isReview_${quizKey}`, isReviewMode.toString());
  }, [quizKey, currentIndex, answers, timeLeft, quizState, isReviewMode]);

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
localStorage.removeItem(`quiz_answers_${quizKey}`);
localStorage.removeItem(`quiz_index_${quizKey}`);
localStorage.removeItem(`quiz_time_${quizKey}`);
localStorage.removeItem(`quiz_state_${quizKey}`);
localStorage.removeItem(`quiz_isReview_${quizKey}`);
localStorage.removeItem(`quiz_data_${quizKey}`);
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
      if (answers[q.question_id] === q.correct_answer) {
        score++;
      }
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