

export const QuestionMap = ({ questions, currentIndex, answers, onNavigate }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Question Map</h3>
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q: any, idx: number) => {
        const isCurrent = idx === currentIndex;
        const isAnswered = !!answers[q.id];
        
        return (
          <button 
            key={q.id}
            onClick={() => onNavigate(idx)}
            className={`aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all
              ${isCurrent ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600' 
              : isAnswered ? 'bg-indigo-600 text-white' 
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  </div>
);