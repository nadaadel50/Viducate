import { useNavigate } from "react-router";
import { COLORS } from "../../../../core/constants";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useDashboard } from "../hooks/use_dashboard";
import { AppRoutesNames } from "../../../../app/routers/routes";

export function UserCard() {
  const { data } = useDashboard();
  const { setVideoId } = useLearningSession();
  const userName = data?.user.name || "Learner";
  const navigate = useNavigate();

  const handleClick = async () => {
    if (data?.continue_learning.length! > 0) {
      await setVideoId(data?.continue_learning[0].videoId!);
      navigate(AppRoutesNames.wathcVideo);
    }
  };
  return (
    <div
      style={{ backgroundImage: COLORS.background.premiumGradient }}
      className="rounded-3xl  p-8 relative overflow-hidden shadow-soft"
    >
      <div className="flex flex-col items-start justify-between relative z-10 gap-3">
        <h2 className="text-4xl font-bold text-slate-800  tracking-tight">
          Hello, {userName}! ✨
        </h2>

        <p className=" text-slate-700  font-medium leading-relaxed text-md">
          Every learning journey starts with a single step. Stay curious, keep
          exploring, and remember that every lesson you complete brings you
          closer to your goals. 😉
        </p>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleClick}
            className="cursor-pointer bg-white/90  text-indigo-600  px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="material-symbols-outlined">play_lesson</span>
            Resume Learning
          </button>
          <button
            onClick={() => {
              navigate(AppRoutesNames.uploadPage);
            }}
            style={{ background: COLORS.brand.gradient }}
            className=" cursor-pointer text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl  hover:shadow-[0_12px_35px_rgba(90,11,177,0.45)]  duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Upload Video
          </button>
        </div>
      </div>
    </div>
  );
}
