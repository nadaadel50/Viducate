import { useState } from "react";
import { CompeleteProgress } from "../widgets/complete_progress";
import { FlashCard } from "../widgets/flash_card";
import { UserLevelBtn } from "../widgets/user_level_btn";

export function FlashCards() {
  const flashcardsData = {
    segment_id: 1,
    segment_number: 1,
    title: "React Basics",
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
      },
      {
        flashcard_id: 8,
        segment_id: 1,
        video_id: 101,
        question: "What is the difference between state and props?",
        answer:
          "State is managed داخل the component, while props are passed from parent components.",
        language: "en",
        difficulty: "medium",
        created_at: "2026-04-26T04:06:17.875Z",
      },
    ],
  };
  const [cardNumber, setCardNumber] = useState<number>(1);
  const [selecedUserLevelBtn, setSelectedUserLevelBtn] = useState<
    string | null
  >(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  return (
    <div className="w-full font-display bg-[#f6f6f8] h-fit">
      <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-5xl mx-auto">
        {/* progress of flashcards */}
        <CompeleteProgress
          cardNumber={cardNumber}
          cardsLenght={flashcardsData.flashcards.length}
        />

        {/* cards */}

        <FlashCard
          answer={flashcardsData.flashcards[cardNumber-1].answer}
          isFliped={isFlipped}
          segmentId={flashcardsData.segment_id}
          onClick={() => {
            setIsFlipped(!isFlipped);
          }}
        />

        {/* user reaction btn */}

        <div className="flex w-full max-w-xl justify-center items-center gap-5">
          <UserLevelBtn
            diffStyle={"easy"}
            onClick={() => {
              setSelectedUserLevelBtn("easy");
            }}
            isSelected={selecedUserLevelBtn === "easy"}
          />
          <UserLevelBtn
            diffStyle={"good"}
            onClick={() => {
              setSelectedUserLevelBtn("good");
            }}
            isSelected={selecedUserLevelBtn === "good"}
          />
          <UserLevelBtn
            diffStyle={"hard"}
            onClick={() => {
              setSelectedUserLevelBtn("hard");
            }}
            isSelected={selecedUserLevelBtn === "hard"}
          />
        </div>

        {/* go to next card btn */}

        <button
        onClick={
          ()=>{
            setCardNumber(prev => prev + 1)
          }
        }
         className="uppercase w-full max-w-2xl mt-10  flex justify-center border border-[#4f46e5]/50  items-center gap-2 bg-white text-[#4f46e5] px-8 py-3 rounded-full  hover:border-[#4f46e5] hover:shadow-lg transition-all active:scale-95 font-bold text-lg tracking-wide group/btn cursor-pointer">
          <span>Next Card</span>
        </button>
        <p className="text-xs mt-2 text-gray-400">to go to next card , select first how will did you know this</p>
      </div>
    </div>
  );
}
