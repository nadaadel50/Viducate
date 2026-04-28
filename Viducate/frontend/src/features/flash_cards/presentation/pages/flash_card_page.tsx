import { useState } from "react";
import { CompeleteProgress } from "../widgets/complete_progress";
import { FlashCard } from "../widgets/flash_card";
import { UserLevelBtn } from "../widgets/user_level_btn";
import type { Flashcard, Segment } from "../../domain/entity/flash_card_entity";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";
import { Difficulty } from "../../domain/entity/difficaulty";
import { DIFFICULTY_TIME } from "../../domain/entity/difficaulty_time";

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
      {
        flashcard_id: 4,
        segment_id: 1,
        video_id: 101,
        question: "What is useState?",
        answer:
          "A React hook that allows you to add state to functional components.",
        language: "en",
        difficulty: "medium",
        created_at: "2026-04-26T04:06:17.875Z",
        segment_start_time: 0,
        segment_end_time: 0,
        segment_start_label: "",
      },
      {
        flashcard_id: 5,
        segment_id: 1,
        video_id: 101,
        question: "What is useEffect?",
        answer: "A hook used to handle side effects in functional components.",
        language: "en",
        difficulty: "medium",
        created_at: "2026-04-26T04:06:17.875Z",
        segment_start_time: 0,
        segment_end_time: 0,
        segment_start_label: "",
      },
      {
        flashcard_id: 6,
        segment_id: 1,
        video_id: 101,
        question: "What are props in React?",
        answer: "Props are inputs passed to components to configure them.",
        language: "en",
        difficulty: "easy",
        created_at: "2026-04-26T04:06:17.875Z",
        segment_start_time: 0,
        segment_end_time: 0,
        segment_start_label: "",
      },
      {
        flashcard_id: 7,
        segment_id: 1,
        video_id: 101,
        question: "What is the Virtual DOM?",
        answer:
          "A lightweight copy of the real DOM used by React to optimize updates.",
        language: "en",
        difficulty: "medium",
        created_at: "2026-04-26T04:06:17.875Z",
        segment_start_time: 0,
        segment_end_time: 0,
        segment_start_label: "",
      },
      {
        flashcard_id: 8,
        segment_id: 1,
        video_id: 101,
        question: "What is the difference between state and props?",
        answer:
          "State is managed inside the component, while props are passed from parent components.",
        language: "en",
        difficulty: "medium",
        created_at: "2026-04-26T04:06:17.875Z",
        segment_start_time: 0,
        segment_end_time: 0,
        segment_start_label: "",
      },
    ],
  };
  const [flashCardAnswers, setFlashCardAnswers] = useState<FlashcardAnswer[]>(
    [],
  );
  const [cardNumber, setCardNumber] = useState<number>(1);

  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleAnswer = (difficulty: Difficulty) => {
    const currentCard = flashcardsData.flashcards[cardNumber - 1];

    if (!currentCard) return;

    const newAnswer: FlashcardAnswer = {
      cardInfo: currentCard,
      selectedDifficulty: difficulty,
      retriveTime: DIFFICULTY_TIME[difficulty],
    };

    setFlashCardAnswers((prev) => [...prev, newAnswer]);
    setIsFlipped(false);
    setTimeout(() => {
      setCardNumber((prev) => prev + 1);
    }, 350);
    console.log(flashCardAnswers);
  };

  return (
    <div className="w-full font-display bg-[#f6f6f8] min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-5xl mx-auto">
        {/* progress of flashcards */}
        <CompeleteProgress
          cardNumber={cardNumber}
          cardsLenght={flashcardsData.flashcards.length}
        />

        {/* cards */}

        <FlashCard
          key={cardNumber}
          cardData={flashcardsData.flashcards[cardNumber - 1]}
          isFliped={isFlipped}
          onClick={() => {
            setIsFlipped(!isFlipped);
          }}
        />

        {/* user reaction btn */}
        <div
          className={`flex w-full max-w-xl justify-center items-center gap-5 transition-all duration-500
    ${isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}
  `}
        >
          <UserLevelBtn
            onClick={() => handleAnswer(Difficulty.Easy)}
            diffStyle={Difficulty.Easy}
          />

          <UserLevelBtn
            diffStyle={Difficulty.Good}
            onClick={() => handleAnswer(Difficulty.Good)}
          />

          <UserLevelBtn
            diffStyle={Difficulty.Hard}
            onClick={() => handleAnswer(Difficulty.Hard)}
          />

          <UserLevelBtn
            diffStyle={Difficulty.Again}
            onClick={() => handleAnswer(Difficulty.Again)}
          />
        </div>
      </div>
    </div>
  );
}
