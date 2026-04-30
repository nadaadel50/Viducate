import { useEffect, useState } from "react";
import { CompeleteProgress } from "../widgets/complete_progress";
import { FlashCard } from "../widgets/flash_card";
import { UserLevelBtn } from "../widgets/user_level_btn";
import type { Flashcard } from "../../domain/entity/flash_card_entity";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";
import { Difficulty } from "../../domain/entity/difficaulty";
import { DIFFICULTY_TIME } from "../../domain/entity/difficaulty_time";
import { useParams } from "react-router";
import { useSegmentFlashcards } from "../hooks/use_segment_flash_cards";
import Loading from "../../../../core/widgets/loading";
import ErrorMessage from "../../../../core/widgets/error";
import FinishSessionCard from "../section/finish_flash_cards";
import { STORAGE_KEYS } from "../../../../core/constants";
import { LoadingScreen } from "../../../../core/widgets/advanced_loading";
import { Layers } from "lucide-react";

export function FlashCards() {
  const { segmentId } = useParams<{ segmentId: string }>();
  const segmentIdNumber = Number(segmentId);
  const [answers, setAnswers] = useState<FlashcardAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [checkExistFirst, setCheckExistFirst] = useState(false);
  // add this with the other useState calls
  const [reviewCards, setReviewCards] = useState<Flashcard[] | null>(null);

  // LOAD session for this specific segment
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setReviewCards(null);
    setAnswers([]);

    const saved = localStorage.getItem(
      `${STORAGE_KEYS.flashcardSession}_${segmentIdNumber}`,
    );
    if (!saved) {
      setCheckExistFirst(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || []);
      setCurrentIndex(parsed.currentIndex || 0);
      setReviewCards(parsed.reviewCards || null);
      setIsFinished(parsed.isFinished || false);
    } catch (e) {
      console.error("Failed to parse session", e);
    }

    setCheckExistFirst(true);
  }, [segmentIdNumber]);

  // SAVE session for this specific segment
  useEffect(() => {
    if (!checkExistFirst) return;
    if (!flashcardsData || flashcardsData.flashcards.length === 0) return;

    const data = {
      segmentId: segmentIdNumber,
      answers,
      currentIndex,
      isFinished,
      reviewCards,
    };
    localStorage.setItem(
      `${STORAGE_KEYS.flashcardSession}_${segmentIdNumber}`,
      JSON.stringify(data),
    );
  }, [
    answers,
    currentIndex,
    isFinished,
    reviewCards,
    segmentIdNumber,
    checkExistFirst,
  ]);
  const {
    data: flashcardsData,
    isLoading,
    error,
  } = useSegmentFlashcards(segmentIdNumber);

  if (isLoading)
    return (
      <LoadingScreen
        icon={<Layers />}
        titlePrefix={"Cooking up your flashcards"}
        titleHighlight={"they’ll be ready soon"}
        subtitle={"Turning key concepts into easy-to-review flashcards"}
      />
    );
  if (error) return <ErrorMessage errorMessage={error.message} />;
  if (!flashcardsData || flashcardsData.flashcards.length === 0)
    return (
      <LoadingScreen
        icon={<Layers />}
        titlePrefix={"Cooking up your flashcards"}
        titleHighlight={"they’ll be ready soon"}
        subtitle={"Turning key concepts into easy-to-review flashcards"}
      />
    );
  if (flashcardsData) {
    // this fn when finish the session

    const resetSession = (dueCards?: FlashcardAnswer[]) => {
      if (dueCards && dueCards.length > 0) {
        const dueIds = new Set(dueCards.map((d) => d.cardId));
        const cardsToReview = flashcardsData.flashcards.filter((c) =>
          dueIds.has(c.flashcard_id),
        );
        setReviewCards(cardsToReview);
        setCurrentIndex(0);
        setIsFinished(false);
      } else {
        setAnswers([]);
        setReviewCards(null);
        setCurrentIndex(0);
        setIsFinished(false);
       localStorage.removeItem(`${STORAGE_KEYS.flashcardSession}_${segmentIdNumber}`);
      }
    };

    const goToNextCard = () => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= totalCards) {
          setIsFinished(true);
          return prev;
        }
        return prev + 1;
      });
    };

    const handleAnswer = (difficulty: Difficulty) => {
      if (!currentCard) return;

      const newAnswer: FlashcardAnswer = {
        cardId: currentCard.flashcard_id,
        selectedDifficulty: difficulty,
        nextReviewAt: DIFFICULTY_TIME[difficulty] + Date.now(),
      };
      setAnswers((prev) => {
        const exists = prev.find((a) => a.cardId === newAnswer.cardId);

        if (exists) {
          return prev.map((a) =>
            a.cardId === newAnswer.cardId ? newAnswer : a,
          );
        }

        return [...prev, newAnswer];
      }); // updat only the answr not entire object if the card exist in the answers

      setIsFlipped(false);

      setTimeout(goToNextCard, 350);
    };
    const activeCards = reviewCards ?? flashcardsData.flashcards;
    const totalCards = activeCards.length;
    const safeIndex = currentIndex >= totalCards ? 0 : currentIndex;
    const currentCard = activeCards[safeIndex];

    return (
      <div className="w-full font-display bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 min-h-screen flex items-center justify-center">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>

        <div className="relative z-20 w-full">
          {!isFinished && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-5xl mx-auto">
              <CompeleteProgress
                cardsLenght={totalCards}
                cardNumber={currentIndex}
              />

              <FlashCard
                key={currentIndex}
                cardData={currentCard}
                isFliped={isFlipped}
                onClick={() => setIsFlipped((prev) => !prev)}
              />

              <div
                className={`flex w-full max-w-xl justify-center items-center gap-5 transition-all duration-500
          ${isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
              >
                <UserLevelBtn
                  onClick={() => handleAnswer(Difficulty.Easy)}
                  diffStyle={Difficulty.Easy}
                />
                <UserLevelBtn
                  onClick={() => handleAnswer(Difficulty.Good)}
                  diffStyle={Difficulty.Good}
                />
                <UserLevelBtn
                  onClick={() => handleAnswer(Difficulty.Hard)}
                  diffStyle={Difficulty.Hard}
                />
                <UserLevelBtn
                  onClick={() => handleAnswer(Difficulty.Again)}
                  diffStyle={Difficulty.Again}
                />
              </div>
            </div>
          )}

          {isFinished && (
            <FinishSessionCard answers={answers} onEndSession={resetSession} />
          )}
        </div>
      </div>
    );
  }
}
