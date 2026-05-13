
import { FormattedMessage } from 'react-intl';
import { COLORS } from "../../../../core/constants";

interface Props {
  current: number;
  total: number;
  percentage: number;
}

export const QuizProgressBar = ({ current, total, percentage }: Props) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8" style={{ borderColor: COLORS.border.default }}>
    <div className="flex justify-between items-end mb-4">
      <div>
        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: COLORS.brand.primary }}>
          <FormattedMessage id="quiz.question_count" values={{ current, total }} />
        </span>
      </div>
      <span className="text-sm font-bold" style={{ color: COLORS.text.primary }}>
        {Math.round(percentage)}%
      </span>
    </div>
    
    
    <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: COLORS.state.pending }}>
      <div 
        className="h-full rounded-full transition-all duration-500"
        style={{ 
          width: `${percentage}%`,
          background: COLORS.brand.gradient 
        }}
      />
    </div>
  </div>
);