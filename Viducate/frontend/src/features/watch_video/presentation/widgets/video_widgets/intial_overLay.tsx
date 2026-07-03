import { Play } from "lucide-react";

type Props = {
  onStart: () => void;
};

export function InitialPlayOverlay({ onStart }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <button
        onClick={onStart}
        className="cursor-pointer bg-gradient-to-br from-[#359EFF]/70 to-[#5A0BB1]/70
          hover:from-[#5A0BB1] hover:to-[#359EFF]
          text-white p-3 md:p-4 rounded-full transition-all duration-300 scale-100 hover:scale-110"
      >
        <Play className="w-5 h-5 md:w-7 md:h-7" />
      </button>
    </div>
  );
}
