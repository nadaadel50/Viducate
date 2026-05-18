import type { ContinueLearningEntity } from "../../../domain/entity/continue_learning";
import { formatTimeToHoursMinutes } from "../../utils/format_dashboard_times";

type CardDetailsProps = {
 
    cardData:ContinueLearningEntity
  
  
}

export function CardDetails(props:CardDetailsProps) {
  return (
    <div className="p-4">
      <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
       {props.cardData.title}
      </h3>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-semibold">
          {Math.round((props.cardData.currentTime / props.cardData.duration) * 100)}% Complete
        </span>

        <span className="flex items-center gap-1">
          <span
            style={{ fontSize: 16 }}
            className="material-symbols-outlined"
          >
            schedule
          </span>
            {formatTimeToHoursMinutes(props.cardData.duration)}
        </span>
      </div>
    </div>
  );
}