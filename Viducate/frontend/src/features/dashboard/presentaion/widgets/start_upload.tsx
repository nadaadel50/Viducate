import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";
import { AppRoutesNames } from "../../../../app/routers/routes";
import NoSavedVideosAnimation from "../../../../core/animations/no_saved_videos";
import { CustomButton } from "../../../../core/componants/custum_btn";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
} from "../../../../core/constants/fonts_update";

export function StartUpload() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
      <NoSavedVideosAnimation />

      <div className="space-y-2">
        <h2
          className={`
            ${FONT_SIZE.size20}
            ${FONT_WEIGHT.bold}
            text-slate-800
          `}
        >
          <FormattedMessage id="dashboard.empty.title" />
        </h2>

        <p
          className={`
            ${FONT_SIZE.size14}
            ${LINE_HEIGHT.relaxed}
            text-slate-400
          `}
        >
          <FormattedMessage id="dashboard.empty.description" />
        </p>
      </div>

      <CustomButton
        leftIcon={
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
            add_circle
          </span>
        }
        onClick={() => navigate(AppRoutesNames.uploadVideo)}
        className="border border-indigo-200 bg-white text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50"
      >
        <FormattedMessage id="dashboard.empty.addFirstVideo" />
      </CustomButton>
    </div>
  );
}
