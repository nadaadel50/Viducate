import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { STORAGE_KEYS } from "../../../../core/constants";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";
import type { FlashCardDetials } from "../../domain/entity/flash_card_response";
import type { Difficulty } from "../../domain/entity/difficaulty";
import { DIFFICULTY_TIME } from "../../domain/entity/difficaulty_time";
import { useSegmentFlashcards } from "./use_segment_flash_cards";
import { useVideoFlashcards } from "./use_video_flash_cards";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

const STORAGE_KEY = (id: number | "video", videoId?: number | string) =>
  id === "video"
    ? `${STORAGE_KEYS.flashcardSession}_video_${videoId}`
    : `${STORAGE_KEYS.flashcardSession}_${id}`;

export function useFlashcardSession() {
  const { segmentId } = useParams<{ segmentId: string }>(); // get id from parms
  const segmentIdNumber = Number(segmentId);
  const navigate = useNavigate();
  const { videoId } = useLearningSession();
  const [answers, setAnswers] = useState<FlashcardAnswer[]>([]); // user answers in flashcards
  const [currentIndex, setCurrentIndex] = useState(0); // curent flashcard
  const [isFlipped, setIsFlipped] = useState(false); // is this flashcard flipped or not
  const [isFinished, setIsFinished] = useState(false); // is user finish the flash cards to display his progress
  const [reviewCards, setReviewCards] = useState<FlashCardDetials[] | null>(
    null,
  ); // the review cards user need to see
  const [hydrated, setHydrated] = useState(false); // if data get from local storage or not

  const segmentQuery = useSegmentFlashcards(segmentIdNumber!);
  const videoQuery = useVideoFlashcards();

  const {
    data: flashcardsData,
    isLoading,
    error,
  } = segmentIdNumber ? segmentQuery : videoQuery;

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setReviewCards(null);
    setAnswers([]);
    const resolvedId = !isNaN(segmentIdNumber) ? segmentIdNumber : "video";

    const saved = sessionStorage.getItem(STORAGE_KEY(resolvedId, videoId!));
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers ?? []);
      setCurrentIndex(parsed.currentIndex ?? 0);
      setReviewCards(parsed.reviewCards ?? null);
      setIsFinished(parsed.isFinished ?? false);
    }

    setHydrated(true);
  }, [segmentIdNumber, videoId]);


  useEffect(() => {
    if (!hydrated || !flashcardsData?.length) return;
    const resolvedId = !isNaN(segmentIdNumber) ? segmentIdNumber : "video";

    sessionStorage.setItem(
      STORAGE_KEY(resolvedId, videoId!),
      JSON.stringify({
        segmentId: segmentIdNumber,
        videoId,
        answers,
        currentIndex,
        isFinished,
        reviewCards,
      }),
    );
  }, [
    answers,
    currentIndex,
    isFinished,
    reviewCards,
    videoId,
    segmentIdNumber,
  ]);

  const activeCards = reviewCards ?? flashcardsData ?? [];
  const totalCards = activeCards.length;
  const safeIndex = currentIndex >= totalCards ? 0 : currentIndex;
  const currentCard = activeCards[safeIndex];

  const handleAnswer = (difficulty: Difficulty) => {
    if (!currentCard) return;

    const newAnswer: FlashcardAnswer = {
      cardId: currentCard.flashcard_id,
      selectedDifficulty: difficulty,
      nextReviewAt: DIFFICULTY_TIME[difficulty] + Date.now(),
    };

    setAnswers((prev) => {
      const exists = prev.some((a) => a.cardId === newAnswer.cardId);
      return exists
        ? prev.map((a) => (a.cardId === newAnswer.cardId ? newAnswer : a))
        : [...prev, newAnswer];
    });

    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= totalCards) setIsFinished(true);
        return next >= totalCards ? prev : next;
      });
    }, 350);
  };

  const resetSession = (dueCards?: FlashcardAnswer[]) => {
    if (dueCards?.length) {
      const dueIds = new Set(dueCards.map((d) => d.cardId));
      setReviewCards(
        flashcardsData!.filter((c: FlashCardDetials) =>
          dueIds.has(c.flashcard_id),
        ),
      );
      setCurrentIndex(0);
      setIsFinished(false);
    } else {
      setAnswers([]);
      setReviewCards(null);
      setCurrentIndex(0);
      setIsFinished(false);

      const resolvedId = !isNaN(segmentIdNumber) ? segmentIdNumber : "video";

      sessionStorage.removeItem(STORAGE_KEY(resolvedId, videoId!));

      navigate(-1);
    }
  };

  return {
    flashcardsData,
    isLoading,
    error,
    answers,
    currentIndex,
    isFlipped,
    isFinished,
    totalCards,
    currentCard,
    setIsFlipped,
    handleAnswer,
    resetSession,
  };
}
