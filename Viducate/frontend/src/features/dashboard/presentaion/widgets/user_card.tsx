import { COLORS } from "../../../../core/constants";
import { useDashboard } from "../hooks/use_dashboard";

export function UserCard() {
  const {data}=useDashboard()
  const userName=data?.user.name || "Learner";
    return (
         <div
                style={{ backgroundImage: COLORS.background.premiumGradient }}
                className="rounded-3xl  p-8 relative overflow-hidden shadow-soft"
              >
                <div className="flex flex-col items-start justify-between relative z-10 gap-3">
                  <h2 className="text-4xl font-bold text-slate-800  tracking-tight">
                    Hello, {userName}! ✨
                  </h2>
        
                  <p className=" text-slate-700  font-medium leading-relaxed">
                    Your dedication to learning is paying off! You’ve mastered 15 new
                    concepts this week. Keep that momentum going!
                  </p>
        
                  <div className="flex gap-4 mt-4">
                    <button className="cursor-pointer bg-white/90  text-indigo-600  px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined">play_lesson</span>
                      Resume Learning
                    </button>
                    <button
                      style={{ background: COLORS.brand.gradient, }}
                      className=" cursor-pointer text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl  hover:shadow-[0_12px_35px_rgba(90,11,177,0.45)]  duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0"
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                      Upload Video
                    </button>
                  </div>
                </div>
              </div>
    )
}