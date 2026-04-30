export const QuizTimer = ({ timeLeft }: any) => {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-border-dark">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
        <span className="material-symbols-outlined">timer</span>
        <span className="text-sm font-semibold uppercase tracking-wide">
          Time Remaining
        </span>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-black/20 rounded-xl p-4">

        <div className="flex flex-col items-center w-16">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {min.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-slate-500 font-medium">MIN</span>
        </div>

        <span className="text-2xl font-bold text-slate-300 dark:text-slate-600 pb-4">
          :
        </span>

        <div className="flex flex-col items-center w-16">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {sec.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-slate-500 font-medium">SEC</span>
        </div>

      </div>
    </div>
  );
};