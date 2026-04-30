export const QuizOptions = ({ question, selectedId, onSelect, isReviewMode }: any) => (
  <div className="space-y-4">
    
    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
      {question.text}
    </h2>

    <div className="flex flex-col gap-3">
      {question.options.map((option: any, index: number) => {
        const isCorrect = option.id === question.correctOptionId;
        const isSelected = selectedId === option.id;

        const label = String.fromCharCode(65 + index); // A B C D

        let style = `
          border-transparent
          bg-white dark:bg-slate-800
          hover:bg-slate-50 dark:hover:bg-slate-700/40
        `;

        if (isReviewMode) {
          if (isCorrect)
            style = "border-green-500 bg-green-50 dark:bg-green-900/20";
          else if (isSelected)
            style = "border-red-500 bg-red-50 dark:bg-red-900/20";
        } else if (isSelected) {
          style = `
            border-indigo-600 
            bg-indigo-50 dark:bg-indigo-900/20
          `;
        }

        return (
          <label key={option.id} className="cursor-pointer group">
            <input
              type="radio"
              className="sr-only"
              checked={isSelected}
              onChange={() => onSelect(option.id)}
            />

            <div
              className={`
                flex items-center justify-between
                p-4 rounded-xl border-2 transition-all duration-200
                ${style}
              `}
            >
              
              {/* LEFT: radio + text */}
              <div className="flex items-center gap-3">
                
                {/* Radio */}
                <div
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}
                  `}
                >
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>

                <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-white">
                  {option.text}
                </span>
              </div>

              {/* RIGHT: A B C D */}
              <span className="text-xs font-bold text-slate-400">
                {label}
              </span>

              {/* Review Icons */}
              {isReviewMode && (
                isCorrect ? (
                  <span className="material-symbols-outlined text-green-600 text-[18px] ml-2">
                    check_circle
                  </span>
                ) : isSelected ? (
                  <span className="material-symbols-outlined text-red-600 text-[18px] ml-2">
                    cancel
                  </span>
                ) : null
              )}
            </div>
          </label>
        );
      })}
    </div>
  </div>
);