import type { ContinueLearningEntity } from "../../../domain/entity/continue_learning";
import { formatTimeToHoursMinutes } from "../../utils/format_dashboard_times";
import { useDashboard } from "../../hooks/use_dashboard";
import { FormattedMessage, useIntl } from "react-intl";
type CardDetailsProps = {
  cardData: ContinueLearningEntity;
};

export function CardDetails(props: CardDetailsProps) {
  const { handleSelectedVideo, handleOpenDeleteMessage } = useDashboard();
  const intl = useIntl();

  return (
    <div className="p-4 ">
      <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
        {props.cardData.title}
      </h3>

      <div className="flex items-center justify-between ">
        {props.cardData.duration && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-semibold">
              <FormattedMessage
                id="dashboard.continueLearning.completed"
                values={{ percent: props.cardData.progress }}
              />
            </span>

            <span className="flex items-center gap-1">
              <span
                style={{ fontSize: 16 }}
                className="material-symbols-outlined"
              >
                schedule
              </span>
              {formatTimeToHoursMinutes(props.cardData.duration, intl)}
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSelectedVideo(props.cardData);
            handleOpenDeleteMessage(true);
          }}
          className=" flex items-center justify-center cursor-pointer p-1.5 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all duration-200"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            delete
          </span>
        </button>
      </div>
    </div>
  );
}
