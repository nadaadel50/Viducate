type FlashCardProps = {
  answer: string;
  isFliped: boolean;
  segmentId: number; 
  onClick: () => void;
};

export function FlashCard({
  answer,
  isFliped,
  segmentId,
  onClick,
}: FlashCardProps) {
  return (
   
    <div
      style={{ perspective: "1000px" }}
      className="relative w-full max-w-2xl h-[420px] group cursor-pointer mb-10"
      onClick={onClick}
    >
   
      <div
        className={`relative w-full h-full text-center transition-all duration-700 
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
          <h3 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
            What is Neuroplasticity?
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
          flex flex-col items-center justify-center 
          p-12 rounded-2xl bg-white"
        >
          <p className="text-[#4f46e5] font-medium text-lg">{answer}</p>

          <p className="text-sm font-medium text-gray-400 mt-10 uppercase tracking-widest">
            Click to go back
          </p>
        </div>
{/* 
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation(); //
              onClick();
            }}
            className="flex  items-center gap-2 bg-[#4f46e5] text-white px-8 py-3 rounded-full shadow-lg shadow-[#4f46e5]/30 hover:shadow-[#4f46e5]/50 transition-all active:scale-95 font-bold text-lg tracking-wide group/btn cursor-pointer"
          >
            <span>Flip Card</span>
            <span className="material-symbols-outlined text-[20px] group-hover/btn:rotate-180 transition-transform duration-500">
              sync
            </span>
          </button>
        </div> */}
      </div>

        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation(); // becase i have 2 flip fn
              onClick();
            }}
            className="flex  items-center gap-2 bg-[#4f46e5] text-white px-8 py-3 rounded-full shadow-lg shadow-[#4f46e5]/30 hover:shadow-[#4f46e5]/50 transition-all active:scale-95 font-bold text-lg tracking-wide group/btn cursor-pointer"
          >
            <span>Flip Card</span>
            <span className="material-symbols-outlined text-[20px] group-hover/btn:rotate-180 transition-transform duration-500">
              sync
            </span>
          </button>
        </div>
    </div>
  );
}