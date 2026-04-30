

interface Props {
  current: number;
  total: number;
  percentage: number;
}

export const QuizProgressBar = ({ current, total, percentage }: Props) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
    <div className="flex justify-between items-end mb-4">
      <div>
        <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Question {current}</span>
        <span className="text-sm text-slate-500"> of {total}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white">{Math.round(percentage)}%</span>
    </div>
    <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div 
  className="h-full bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] rounded-full transition-all duration-500"
  style={{ width: `${percentage}%` }}
/>
    </div>
  </div>
);