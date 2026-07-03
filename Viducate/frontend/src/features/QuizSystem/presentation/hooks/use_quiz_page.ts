import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router";

import { useGenerateQuiz } from "./use_generate_quiz";
import { useQuiz } from "./use_quiz";
import { calculateQuizTime } from "../utlis/quiz_time";

type Difficulty = "easy" | "medium" | "hard";

export function useQuizPage() {
  const {
    state: { videoId, segmentId, difficulty: initialDifficulty },
  } = useLocation();

  const navigate = useNavigate();
  const intl = useIntl();

  const quizStorageKey = useMemo(
    () =>
      segmentId
        ? `active_quiz_key_${segmentId}`
        : `active_quiz_key_video_${videoId}`,
    [segmentId, videoId],
  );

  const savedKey = localStorage.getItem(quizStorageKey);

  const [activeQuizKey, setActiveQuizKey] = useState<string | null>(
    savedKey ?? null,
  );

  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialDifficulty ?? "medium",
  );

  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(!savedKey);

  const {
    quiz,
    isPending,
    generate,
    submitQuiz,
    getSubmitResult,
    isSubmitting,
    isError,
    generateQuizError,
    submitError,
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

  const localQuiz = useMemo(
    () => (savedQuiz ? JSON.parse(savedQuiz) : null),
    [savedQuiz],
  );

  const finalQuiz = useMemo(() => localQuiz || quiz, [localQuiz, quiz]);

  const questions = useMemo(() => finalQuiz?.questions ?? [], [finalQuiz]);

  const isArabic = finalQuiz?.language === "ar";

  const calculatedTime = useMemo(
    () =>
      finalQuiz
        ? calculateQuizTime(
            finalQuiz.total_questions ?? questions.length,
            difficulty,
          )
        : 0,
    [finalQuiz, questions.length, difficulty],
  );

  const submitResult = getSubmitResult(finalQuiz?.quiz_id);

  useEffect(() => {
    if (!quiz || !activeQuizKey) return;

    localStorage.setItem(`quiz_data_${activeQuizKey}`, JSON.stringify(quiz));
  }, [quiz, activeQuizKey]);

  const answersRef = useRef<Record<string, string>>({});

  const handleSubmit = useCallback(() => {
    if (!finalQuiz) return;

    submitQuiz(finalQuiz.quiz_id, answersRef.current, questions);
  }, [finalQuiz, questions, submitQuiz]);

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

  const handleSelectDifficulty = useCallback(
    (newDifficulty: Difficulty) => {
      setIsDifficultyModalOpen(false);

      if (activeQuizKey) {
        resetQuiz();
      }

      if (finalQuiz?.quiz_id) {
        localStorage.removeItem(`quiz_submit_${finalQuiz.quiz_id}`);
      }

      const newQuizKey = segmentId
        ? `${segmentId}_${newDifficulty}_${Date.now()}`
        : `video_${videoId}_${newDifficulty}_${Date.now()}`;

      localStorage.setItem(quizStorageKey, newQuizKey);

      setDifficulty(newDifficulty);
      setActiveQuizKey(newQuizKey);

      generate();
    },
    [
      activeQuizKey,
      finalQuiz,
      generate,
      resetQuiz,
      segmentId,
      quizStorageKey,
      videoId,
    ],
  );

  useEffect(() => {
    if (!activeQuizKey) return;

    const hasLocalQuiz = Boolean(
      localStorage.getItem(`quiz_data_${activeQuizKey}`),
    );

    if (!hasLocalQuiz) {
      generateRef.current();
    }
  }, [activeQuizKey]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, [setCurrentIndex]);

  const handleReview = useCallback(() => {
    setIsReviewMode(true);
    setQuizState("playing");
    setCurrentIndex(0);
  }, [setCurrentIndex, setIsReviewMode, setQuizState]);

  const handleNext = useCallback(() => {
    if (currentIndex === questions.length - 1 && !isReviewMode) {
      handleSubmit();
      setQuizState("results");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [
    currentIndex,
    questions.length,
    isReviewMode,
    handleSubmit,
    setCurrentIndex,
    setQuizState,
  ]);

  const handleCloseDifficultyModal = useCallback(() => {
    if (!activeQuizKey) {
      navigate(-1);
      return;
    }

    setIsDifficultyModalOpen(false);
  }, [activeQuizKey, navigate]);

  const currentSubmitQuestion = submitResult?.questions.find(
    (question) => question.questionId === currentQuestion?.question_id,
  );

  return {
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
    handleSubmit,

    handleCloseDifficultyModal,
    handleSelectDifficulty,

    setCurrentIndex,
    setQuizState,
    setIsReviewMode,
    setIsDifficultyModalOpen,
    isError,
    generateQuizError,
    submitError,
  };
}
