import { useEffect, useState } from "react";
import { CompeleteProgress } from "../widgets/complete_progress";
import { FlashCard } from "../widgets/flash_card";
import { UserLevelBtn } from "../widgets/user_level_btn";
import type { Flashcard, Segment } from "../../domain/entity/flash_card_entity";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";
import { Difficulty } from "../../domain/entity/difficaulty";
import { DIFFICULTY_TIME } from "../../domain/entity/difficaulty_time";
import { useParams, useSearchParams } from "react-router";
import { useSegmentFlashcards } from "../hooks/use_segment_flash_cards";
import Loading from "../../../../core/widgets/loading";
import ErrorMessage from "../../../../core/widgets/error";
import CompleteSessionAnimation from "../../../../core/animations/complete_ani";
import FinishSessionCard from "../section/finish_flash_cards";
import { STORAGE_KEYS } from "../../../../core/constants";

export function FlashCards() {
  const flashcardsData: Segment = {
    segment_id: 1,
    segment_number: 1,
    title: "React Basics",
    start_time: 0,
    end_time: 0,
    start_time_label: "",
    end_time_label: "",
    flashcards: [
      {
        flashcard_id: 1,
        segment_id: 1,
        video_id: 101,
        question: "What is React?",
        answer: "A JavaScript library for building user interfaces.",
        language: "en",
        difficulty: "easy",
        created_at: "2026-04-26T04:06:17.875Z",
        segment_start_time: 0,
        segment_end_time: 0,
        segment_start_label: "",
      },
      {
        flashcard_id: 2,
        segment_id: 1,
        video_id: 101,
        question: "What is JSX?",
        answer:
          "A syntax extension for JavaScript that looks like HTML and is used in React.",
        language: "en",
        difficulty: "easy",
        created_at: "2026-04-26T04:06:17.875Z",
        segment_start_time: 0,
        segment_end_time: 0,
        segment_start_label: "",
      },
      {
        flashcard_id: 3,
        segment_id: 1,
        video_id: 101,
        question: "What is a component in React?",
        answer: "A reusable piece of UI that can be a function or class.",
        language: "en",
        difficulty: "easy",
        created_at: "2026-04-26T04:06:17.875Z",
        segment_start_time: 0,
        segment_end_time: 0,
        segment_start_label: "",
      },
    ],
  };

  const [answers, setAnswers] = useState<FlashcardAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [checkExistFirst, setCheckExistFirst] = useState(false);
  // add this with the other useState calls
  const [reviewCards, setReviewCards] = useState<Flashcard[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.flashcardSession);

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
  }, []);

  // this fn to get the data if exist from local storage
  useEffect(() => {
    if (!checkExistFirst) return; // to make sure that see if exist data first then if not set new data
    // in the save useEffect
    const data = {
      answers,
      currentIndex,
      isFinished,
      reviewCards, // add this
    };

    localStorage.setItem(STORAGE_KEYS.flashcardSession, JSON.stringify(data));
  }, [answers, currentIndex, isFinished,reviewCards]);

  // this fn when finish the session
 
  const resetSession = (dueCards?: FlashcardAnswer[]) => {
    if (dueCards && dueCards.length > 0) {
      const dueIds = new Set(dueCards.map((d) => d.cardId));
      const cardsToReview = flashcardsData.flashcards.filter((c) =>
        dueIds.has(c.flashcard_id),
      );
      setReviewCards(cardsToReview); // only the due cards
      setCurrentIndex(0);
      setIsFinished(false);
    } else {
   
      setAnswers([]);
      setReviewCards(null);
      setCurrentIndex(0);
      setIsFinished(false);
      localStorage.removeItem(STORAGE_KEYS.flashcardSession);
    }
  };

  const goToNextCard = () => {
    console.log("current inded", currentIndex);
    console.log("total cards", totalCards);
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
        return prev.map((a) => (a.cardId === newAnswer.cardId ? newAnswer : a));
      }

      return [...prev, newAnswer];
    }); // updat only the answr not entire object if the card exist in the answers

    setIsFlipped(false);

    setTimeout(goToNextCard, 350);
  };

  // with these
  const activeCards = reviewCards ?? flashcardsData.flashcards;
  const totalCards = activeCards.length;
  const currentCard = activeCards[currentIndex];

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
