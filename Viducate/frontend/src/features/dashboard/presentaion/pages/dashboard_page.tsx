import { Car } from "lucide-react";
import { COLORS } from "../../../../core/constants";
import { ActivityCard } from "../widgets/chart/active_chart/activity_chart";

import { ProgressPart } from "../widgets/progress/progress_part";
import { UserCard } from "../widgets/user_card";
import { CardLayout } from "../widgets/card_laylout";
import { CardDetails } from "../widgets/card_details";
import { ContinueLearningCard } from "../widgets/cotinue_learning_card";

export function DashboardPage() {
  return (
    <div
      style={{ background: COLORS.background.moreLight }}
      className="flex flex-col w-full py-10 px-30 font-display min-h-screen gap-10 "
    >
      {/* user card */}
      <UserCard />

      {/* 4 cards */}

      <ProgressPart />

      {/* charts and recent activity */}
      {/* <ActivityCard
        currentStreak={5}
        days={[
          { name: "Mon", active: true, isToday: false },
          { name: "Tue", active: true, isToday: false },
          { name: "Wed", active: true, isToday: false },
          { name: "Thu", active: true, isToday: true },
          { name: "Fri", active: false, isToday: false },
          { name: "Sat", active: false, isToday: false },
          { name: "Sun", active: false, isToday: false },
        ]}
      /> */}

      {/* contiune learning */}

      <div className="flex flex-col gap-6">
        {/* header */}
        <h2 className="text-3xl font-bold text-slate-900 ">
          Continue Learning
        </h2>

        {/* {search} */}
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">
              search
            </span>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200  rounded-xl leading-5 bg-white  text-slate-900  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-display transition-all shadow-soft"
            placeholder="Search for saved videos..."
          />
        </div>

        <div className="grid grid-cols-3 gap-8">
         <ContinueLearningCard />
         <ContinueLearningCard />
         <ContinueLearningCard />
          
        </div>
      </div>
    </div>
  );
}
