import { useEffect, useState } from "react";
import CompleteSessionAnimation from "../../../../core/animations/complete_ani";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";
import { StatCard } from "../widgets/state_card";
import { STORAGE_KEYS } from "../../../../core/constants";

type Props = {
  answers: FlashcardAnswer[];
  onEndSession: (dueCards?: FlashcardAnswer[]) => void;
};

export function FinishSessionCard({ answers, onEndSession }: Props) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const counts = {
    easy: 0,
    good: 0,
    hard: 0,
    again: 0,
  };
  answers.forEach((a) => {
    counts[a.selectedDifficulty as keyof typeof counts]++;
  });

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []); // this to render the time and duecards to take the cards that its time came

  const dueCards = answers.filter((a) => a.nextReviewAt <= now); // get all cards of the time

  const nextReviewAt =
    answers.length > 0 ? Math.min(...answers.map((a) => a.nextReviewAt)) : null; // see the min next time card

  const timeLeft = nextReviewAt
    ? Math.max(0, Math.floor((nextReviewAt - now) / 1000))
    : 0;

  return (
    <div className="flex-1 flex flex-col items-center  justify-center p-10 w-full max-w-5xl mx-auto gap-10 bg-white shadow-lg rounded-3xl">
      <CompleteSessionAnimation />

      <div className="text-center">
        <p className="text-xl font-medium text-gray-700">Next review in</p>
        <p className="text-4xl font-bold mt-2">
          {dueCards.length > 0 ? (
            <button
              onClick={() => {
                onEndSession(dueCards);
              }}
              className=" cursor-pointer group relative px-4 py-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                Ready to review
                <span className="text-lg group-hover:animate-bounce">🔥</span>
              </span>

              {/* glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-green-400 opacity-0 group-hover:opacity-20 blur-xl transition"></div>
            </button>
          ) : (
            <p className="text-4xl font-bold">{formatTime(timeLeft)}</p>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-xl">
        <StatCard title="Easy" value={counts.easy} color="green" />
        <StatCard title="Good" value={counts.good} color="blue" />
        <StatCard title="Hard" value={counts.hard} color="yellow" />
        <StatCard title="Again" value={counts.again} color="red" />
      </div>

      <div className="relative flex flex-col items-center mt-4 w-full">
        <button
          onClick={() => onEndSession()}
          className="group cursor-pointer w-full px-6 py-3 rounded-2xl font-semibold text-[#4f46e5] border border-[#4f46e5]/40 bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            End Session
          </span>

          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300"></div>
        </button>

        <p className="absolute -bottom-6 text-xs text-gray-500 text-center">
          This will reset your session and clear your progress.
        </p>
      </div>
    </div>
  );
}

export default FinishSessionCard;
