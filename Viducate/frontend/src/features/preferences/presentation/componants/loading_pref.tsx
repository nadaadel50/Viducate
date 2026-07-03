export const LoadingPreferences = () => {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
      <div className="flex gap-1">
        <div className="w-3 h-3 bg-[#5A0BB1] rounded-full animate-bounce [animation-delay:0ms]" />
        <div className="w-3 h-3 bg-[#5A0BB1] rounded-full animate-bounce [animation-delay:150ms]" />
        <div className="w-3 h-3 bg-[#5A0BB1] rounded-full animate-bounce [animation-delay:300ms]" />
        <div className="w-3 h-3 bg-[#5A0BB1] rounded-full animate-bounce [animation-delay:450ms]" />
        <div className="w-3 h-3 bg-[#5A0BB1] rounded-full animate-bounce [animation-delay:600ms]" />
      </div>
    </div>
  );
};
