import { CheckCircle, RefreshCw, Circle, XCircle } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { COLORS } from '../../../../core/constants/colors';

interface StepProps {
  labelId: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  isLast?: boolean;
}
export const AnalysisStepItem = ({ labelId, status, isLast }: StepProps) => {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isFailed = status === 'failed';
  const getColors = () => {
    if (isCompleted) return { icon: COLORS.state.success, text: COLORS.state.success, line: COLORS.state.success };
    if (isActive) return { icon: COLORS.brand.primary, text: COLORS.brand.primary, line: COLORS.border.default };
    if (isFailed) return { icon: COLORS.state.error, text: COLORS.state.error, line: COLORS.state.error };
    return { icon: COLORS.text.muted, text: COLORS.text.muted, line: COLORS.border.default };
  };

  const activeColors = getColors();

  return (
    <div className="grid grid-cols-[40px_1fr] gap-x-2 group">
      
      <div className="flex flex-col items-center pt-1">
        <div 
          className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
          style={{ color: activeColors.icon }}
        >
        {isFailed ? (
            <XCircle size={28} /> 
          ) :isCompleted ? (
            <CheckCircle size={28} />
          ) : isActive ? (
            <RefreshCw className="animate-spin" size={28} />
          ) : (
            <Circle size={28} />
          )}
        </div>
        
        {!isLast && (
          <div 
            className="w-[2px] h-12 mt-1 transition-colors duration-500" 
            style={{ backgroundColor: isCompleted ? COLORS.state.success : COLORS.border.default }}
          />
        )}
      </div>

    
      <div className={`flex flex-col ${!isLast ? 'pb-6' : ''}`}>
        <p 
          className="text-base font-bold transition-colors duration-300"
          style={{ color: (isCompleted || isActive) ? COLORS.text.primary : COLORS.text.muted }}
        >
          <FormattedMessage id={labelId} />
        </p>
        
        <span 
          className="text-xs font-bold uppercase tracking-wider mt-0.5"
          style={{ color: activeColors.text }}
        >
          <FormattedMessage id={`analysis.${status}`} defaultMessage={status} />
        </span>
      </div>
    </div>
  );
};