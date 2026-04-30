
import { COLORS } from '../../../../core/constants/colors';

export const QuestionCard = ({ question, selectedId, onSelect, showHint, onToggleHint }: any) => (
  <div className="flex flex-col gap-6">
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{question.text}</h2>
    
    {question.hint && (
      !showHint ? (
        <button onClick={onToggleHint} className="w-fit px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
          Ask AI for a hint
        </button>
      ) : (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-slate-700">{question.hint}</div>
      )
    )}

    <div className="flex flex-col gap-4">
      {question.options.map((opt: any) => (
        <label key={opt.id} className="cursor-pointer">
          <input type="radio" className="sr-only" checked={selectedId === opt.id} onChange={() => onSelect(opt.id)} />
          <div className={`p-5 rounded-xl border-2 transition-all ${selectedId === opt.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>
            <span className="font-medium">{opt.text}</span>
          </div>
        </label>
      ))}
    </div>
  </div>
);