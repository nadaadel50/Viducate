

interface Props {
  percentage: number;
  score: number;
  total: number;
  onRetry: () => void;
  onReview: () => void;
}

export const QuizResultCard = ({ percentage, score, total, onRetry, onReview }: Props) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
      <span className="material-symbols-outlined text-white text-4xl">emoji_events</span>
    </div>
    
    <h2 className="text-3xl font-bold mb-2 dark:text-white">Quiz Completed!</h2>
    <p className="text-slate-500 mb-8">Great job! Here is how you performed.</p>
    
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800">
      <div className="text-5xl font-black text-indigo-600 mb-2">{percentage}%</div>
      <p className="font-medium text-slate-600 dark:text-slate-300">
        You scored {score} out of {total}
      </p>
    </div>
    
    <div className="flex flex-col gap-3">
      <button 
        onClick={onReview}
        className="w-full py-4 bg-white dark:bg-slate-700 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">visibility</span>
        Review Answers
      </button>
      
      <button 
        onClick={onRetry}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:brightness-110 transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">restart_alt</span>
        Try Again
      </button>
    </div>
  </div>
);