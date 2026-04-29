import { useNavigate } from "react-router";
import type { Flashcard } from "../../domain/entity/flash_card_entity";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { STORAGE_KEYS } from "../../../../core/constants";
import { FilePlay, PlayCircle } from "lucide-react";
import { useSegmentFlashcards } from "../hooks/use_segment_flash_cards";

type FlashCardProps = {
  cardData: Flashcard;
  isFliped: boolean;

  onClick: () => void;
};

export function FlashCard({ isFliped, cardData, onClick }: FlashCardProps) {
  const { setCurrentTime } = useLearningSession();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  const navigate = useNavigate();
  return (
    <div
      style={{ perspective: "1000px" }}
      className="relative w-full max-w-2xl h-[420px] group cursor-pointer mb-10"
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full text-center transition-all duration-900 
        [transform-style:preserve-3d] 
        ${isFliped ? "rotate-y-180" : ""} 
        shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] 
        rounded-2xl bg-white border border-gray-100`}
      >
        <div
          className="
          absolute inset-0 w-full h-full 
     
          flex flex-col items-center justify-center 
          p-12 rounded-2xl bg-white"
        >
          <h3 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight p-8">
            {cardData.question}
          </h3>

          <p className="text-sm font-medium text-gray-400 mt-10 uppercase tracking-widest">
            Click to reveal answer
          </p>
        </div>

        <div
          className="
          absolute inset-0 w-full h-full 
          [backface-visibility:hidden] 
          rotate-y-180 
          gap-4
          flex flex-col items-center justify-center 
          rounded-2xl bg-white"
        >
          <p className="text-[#4f46e5] font-medium text-lg p-8">
            {cardData.answer}
          </p>

          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
            Click to go back
          </p>
        </div>
      </div>
      <div
  className={`absolute bottom-5 left-1/2 -translate-x-1/2 transition-all duration-300
  ${isFliped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
`}
>
  <button
    className="cursor-pointer flex gap-2 text-sm font-bold text-gray-500 hover:text-[#4f46e5] transition-colors duration-300"
    onClick={() => {
      
      setCurrentTime(cardData.segment_start_time);
      navigate(AppRoutesNames.wathcVideo)
   

    }}
  >
    <FilePlay size={18} />
    <span>
      {`View source in video (${formatTime(cardData.segment_start_time)})`}
    </span>
  </button>
</div>

    </div>
  );
}
