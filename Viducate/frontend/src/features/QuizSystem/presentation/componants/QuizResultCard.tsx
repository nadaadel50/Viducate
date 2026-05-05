
import { FormattedMessage } from 'react-intl';
import { COLORS } from "../../../../core/constants";

export const QuizResultCard = ({ stats, onTakeAnother, onReview }: any) => {
  return (

    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/10 animate-in fade-in duration-500">

      <div 
        className="relative bg-white rounded-[3rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center animate-in zoom-in-95 duration-300" 
        style={{ 
          borderColor: COLORS.border.default,
          borderWidth: '1px',
          width: 'min(90vw, 500px)', 
          aspectRatio: '1 / 1'      
        }}
      >
        
        
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg" style={{ background: COLORS.brand.gradient }}>
          <span className="material-symbols-outlined text-white text-4xl">emoji_events</span>
        </div>

        <h2 className="text-4xl font-black mb-2" style={{ color: COLORS.text.primary }}>
          <FormattedMessage id="quiz.completed" />
        </h2>
        
        <p className="mb-8 text-center text-sm" style={{ color: COLORS.text.secondary }}>
          <FormattedMessage id="quiz.result_msg" />
        </p>

        <div className="rounded-3xl p-6 mb-10 w-full text-center" style={{ backgroundColor: COLORS.icon.background }}>
          <div className="text-6xl font-black mb-1" style={{ color: COLORS.brand.primary }}>
            {stats.percentage}%
          </div>
          <p className="font-bold text-sm" style={{ color: COLORS.text.gray }}>
            <FormattedMessage id="quiz.score_msg" values={{ score: stats.score, total: stats.total }} />
          </p>
        </div>

      
        <div className="flex flex-row gap-3 w-full">
          
          <button 
            onClick={onTakeAnother}
            className="flex-1 py-4 rounded-2xl font-bold text-white text-sm shadow-md hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.button.primary }}
          >
            <span className="material-symbols-outlined text-lg">autorenew</span>
            <span className="whitespace-nowrap"><FormattedMessage id="quiz.take_another" /></span>
          </button>

          
          <button 
            onClick={onReview}
            className="flex-1 py-4 rounded-2xl font-bold border-2 text-sm transition-all hover:bg-slate-50 active:scale-95 flex items-center justify-center gap-2"
            style={{ borderColor: COLORS.button.primary, color: COLORS.button.primary }}
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
            <span className="whitespace-nowrap"><FormattedMessage id="quiz.review_answers" /></span>
          </button>
        </div>

      </div>
    </div>
  );
};