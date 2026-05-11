
import { FormattedMessage } from 'react-intl';
import { COLORS } from "../../../../core/constants";

export const QuizActions = ({ isLast, isFirst, isReviewMode, onNext, onPrevious, canSubmit, onBackToVideo }: any) => {

  const showNextBtn = !isReviewMode || (isReviewMode && !isLast);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3">
      
      <div className="flex justify-between items-center w-full gap-2">
        
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="w-12 h-12 flex items-center justify-center rounded-lg transition hover:bg-slate-50 disabled:opacity-30"
          style={{ color: COLORS.text.secondary }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        
        {showNextBtn && (
          <button
            onClick={onNext}
            disabled={isLast && !canSubmit && !isReviewMode}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2"
            style={{ 
              background: (isLast && !isReviewMode) ? COLORS.state.success : COLORS.brand.gradient,
              opacity: (isLast && !canSubmit && !isReviewMode) ? 0.5 : 1
            }}
          >
            <span className="whitespace-nowrap">
              <FormattedMessage id={isLast && !isReviewMode ? "quiz.submit" : "quiz.next"} />
            </span>
            <span className="material-symbols-outlined">
              {isLast && !isReviewMode ? "done" : "arrow_forward"}
            </span>
          </button>
        )}
      </div>


      {isReviewMode && (
        <button 
          onClick={onBackToVideo}
          className="w-full py-3 rounded-xl font-bold border-2 transition flex items-center justify-center gap-2 hover:bg-slate-50"
          style={{ borderColor: COLORS.brand.primary, color: COLORS.brand.primary }}
        >
          <span className="material-symbols-outlined text-sm">movie</span>
          <FormattedMessage id="quiz.back_to_video" />
        </button>
      )}
    </div>
  );
};