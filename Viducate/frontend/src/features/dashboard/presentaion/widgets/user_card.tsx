import { useNavigate } from "react-router";
import { COLORS } from "../../../../core/constants";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useDashboard } from "../hooks/use_dashboard";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { FormattedMessage, useIntl } from "react-intl";
export function UserCard() {
  const { data } = useDashboard();
  const { setVideoId } = useLearningSession();
  const intl = useIntl();

  const userName =
    data?.user.name || intl.formatMessage({ id: "dashboard.user.defaultName" });
  const navigate = useNavigate();

  const handleClick = async () => {
    if (data?.continue_learning.length! > 0) {
      await setVideoId(data?.continue_learning[0].videoId!);
      navigate(AppRoutesNames.watchVideo);
    }
  };

  return (
    <div
      style={{ backgroundImage: COLORS.background.premiumGradient }}
      className="rounded-2xl md:rounded-3xl px-5 py-4 relative overflow-hidden shadow-soft"
    >
      <div className="flex flex-col items-start justify-between relative z-10 gap-3">
        <h2
          className={`${FONT_STYLES.pageTitle} text-slate-800 tracking-tight`}
        >
          <FormattedMessage
            id="dashboard.user.greeting"
            values={{ name: userName }}
          />
        </h2>

        <p
          className={`${FONT_STYLES.body} text-slate-700 leading-relaxed max-w-3xl`}
        >
          <FormattedMessage id="dashboard.user.description" />
        </p>

        <div className="flex flex-row  gap-3 mt-2 w-full ">
          <button
            onClick={handleClick}
            className="cursor-pointer bg-white/90 text-indigo-600 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-base">
              play_lesson
            </span>
            <FormattedMessage id="dashboard.user.resumeLearning" />
          </button>

          <button
            onClick={() => {
              navigate(AppRoutesNames.uploadVideo);
            }}
            style={{ background: COLORS.brand.gradient }}
            className="cursor-pointer text-white px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="material-symbols-outlined text-base">
              add_circle
            </span>
            <FormattedMessage id="dashboard.user.uploadVideo" />
          </button>
        </div>
      </div>
    </div>
  );
}
