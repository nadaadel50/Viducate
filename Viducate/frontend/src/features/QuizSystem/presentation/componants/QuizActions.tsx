interface Props {
  isLast: boolean;
  isFirst: boolean;
  isReviewMode: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  disabledNext?: boolean;
}

export const QuizActions = ({
  isLast,
  isFirst,
  isReviewMode,
  onNext,
  onPrevious,
  onReset,
  disabledNext,
}: Props) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100">

      {isReviewMode && isLast ? (
        <button
          onClick={onReset}
          className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:brightness-110 transition"
        >
          Back to Results
        </button>
      ) : (
<div className="flex justify-between items-center pt-1 w-full">

  {/* Previous */}
  <button
    onClick={onPrevious}
    disabled={isFirst}
    className="w-12 h-12 flex items-center justify-center rounded-lg
    text-slate-600 dark:text-slate-300
    hover:bg-slate-100 dark:hover:bg-slate-700
    transition
    disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span className="material-symbols-outlined text-[22px]">
      arrow_back
    </span>
  </button>

  {/* Next */}
  <button
    onClick={onNext}
    disabled={disabledNext}
    className="px-6 py-3 bg-gradient-to-br from-[#359EFF] to-[#5A0BB1]
    hover:brightness-110 text-white rounded-lg font-bold
    shadow-lg shadow-[#359EFF]/30 transition-all
    flex items-center gap-3 whitespace-nowrap
    disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span className="whitespace-nowrap">
      {isLast ? "Submit" : "Next Question"}
    </span>

    <span className="material-symbols-outlined text-[20px] shrink-0">
      {isLast ? "done" : "arrow_forward"}
    </span>
  </button>

</div>
      )}

    </div>
  );
};