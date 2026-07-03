import { Clock4, Save } from "lucide-react";
import { MediaBtn } from "./media_btn";
import { Toast } from "../../../../core/componants/toast_message";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useHandleSaveProgress } from "../hook/use_handle_save_progress";
import { formatVideoTime } from "../../../../core/utils/fomat_time";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";
import { useIntl } from "react-intl";
export function MainHeader() {
  const { currentTime } = useLearningSession();
  const { selectedTopic, handleSetInitializeCurrentTime } =
    useLearningSession();
  const intl = useIntl();
  const { handleSaveProgress, toastMessage, toastType, clearToast } =
    useHandleSaveProgress();

  const topicDuration = selectedTopic
    ? selectedTopic.end_time - selectedTopic.start_time
    : 0;

  return (
    <div>
      <Toast message={toastMessage} type={toastType} onClose={clearToast} />

      <h1
        className={`${FONT_SIZE.size22} lg:${FONT_SIZE.size30} ${FONT_WEIGHT.semibold} ${LETTER_SPACING.tight} mb-3 sm:mb-4 lg:mb-3 break-words text-slate-900 leading-tight`}
      >
        {selectedTopic?.title}
      </h1>

      <div className="flex items-center justify-between gap-2 lg:gap-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock4 className="h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0" />

          <p className={FONT_SIZE.size13}>{formatVideoTime(topicDuration)}</p>
        </div>

        <MediaBtn
          icon={<Save size={16} />}
          label={intl.formatMessage({
            id: "watch.save",
          })}
          onClick={() => {
            handleSaveProgress();
            handleSetInitializeCurrentTime(currentTime);
          }}
        />
      </div>
    </div>
  );
}
