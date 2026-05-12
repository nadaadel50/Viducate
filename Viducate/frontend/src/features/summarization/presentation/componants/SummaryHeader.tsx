
import { Clock } from 'lucide-react';
import { COLORS } from '../../../../core/constants/colors';
import { FormattedMessage } from "react-intl";
interface SummaryHeaderProps {
  title: string;
  time: string;
}
export const SummaryHeader = ({ title, time }: SummaryHeaderProps) =>(
  <div className="mb-8">
    <div className="flex items-center gap-4 mb-4">
      <span 
        className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2"
        style={{ backgroundColor: COLORS.state.successLight, color: COLORS.state.success }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.state.success }}></span>
         <FormattedMessage id="summary.aiReady" />
      </span>
      <span className="text-sm font-medium flex items-center gap-1" style={{ color: COLORS.brand.primary }}>
        <Clock size={14} /> {time}
      </span>
    </div>
    <h1 className="text-4xl font-extrabold mb-2" style={{ color: COLORS.text.primary }}>{title}</h1>
  
  </div>
);