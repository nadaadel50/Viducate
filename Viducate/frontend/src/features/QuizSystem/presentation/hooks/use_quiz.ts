import { useState, useEffect, useRef } from "react";
import { QuizQuestionEntity } from "../../domain/entity/quiz_entity";

export const useQuiz = (
  questions: QuizQuestionEntity[],
  initialTime: number,
  quizKey: string,
  onTimeUp?: () => void,
) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem(`quiz_index_${quizKey}`);
    return saved ? parseInt(saved) : 0;
  });

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`quiz_answers_${quizKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [timeLeft, setTimeLeft] = useState(0);

  const [quizState, setQuizState] = useState<"playing" | "results">(() => {
    const saved = localStorage.getItem(`quiz_state_${quizKey}`);
    return (saved as "playing" | "results") || "playing";
  });

  const [isReviewMode, setIsReviewMode] = useState(() => {
    return localStorage.getItem(`quiz_isReview_${quizKey}`) === "true";
  });

  const timeInitialized = useRef(false);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!quizKey || !initialTime || questions.length === 0) return;
    const savedEndTime = localStorage.getItem(`quiz_endTime_${quizKey}`);
    if (!savedEndTime) {
      const endTime = Date.now() + initialTime * 60 * 1000;
      localStorage.setItem(`quiz_endTime_${quizKey}`, endTime.toString());
    }
  }, [quizKey, initialTime, questions.length]);

  useEffect(() => {
    localStorage.setItem(`quiz_index_${quizKey}`, currentIndex.toString());
    localStorage.setItem(`quiz_answers_${quizKey}`, JSON.stringify(answers));
    localStorage.setItem(`quiz_state_${quizKey}`, quizState);
    localStorage.setItem(`quiz_isReview_${quizKey}`, isReviewMode.toString());
  }, [quizKey, currentIndex, answers, quizState, isReviewMode]);


  useEffect(() => {
    if (questions.length === 0 || quizState !== "playing" || isReviewMode)
      return;

    const tick = () => {
      const endTime = localStorage.getItem(`quiz_endTime_${quizKey}`);
      if (!endTime) return;

      const remaining = Math.max(
        0,
        Math.floor((Number(endTime) - Date.now()) / 1000),
      );
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setQuizState("results");
        onTimeUpRef.current?.();
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [quizKey, quizState, isReviewMode, questions.length]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionId: string) => {
    if (isReviewMode || quizState === "results") return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.question_id]: optionId,
    }));
  };

  const resetQuiz = () => {
    localStorage.removeItem(`quiz_answers_${quizKey}`);
    localStorage.removeItem(`quiz_index_${quizKey}`);
    localStorage.removeItem(`quiz_time_${quizKey}`);
    localStorage.removeItem(`quiz_state_${quizKey}`);
    localStorage.removeItem(`quiz_isReview_${quizKey}`);
    localStorage.removeItem(`quiz_data_${quizKey}`);
    localStorage.removeItem(`quiz_endTime_${quizKey}`);
    timeInitialized.current = false;
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(0);
    setQuizState("playing");
    setIsReviewMode(false);
  };

  const isAllAnswered = questions.every(
    (q) => answers[q.question_id] !== undefined,
  );

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
    setIsReviewMode,
    isAllAnswered,
    resetQuiz,
    progress: ((currentIndex + 1) / questions.length) * 100,
  };
};
