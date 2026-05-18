import { useDashboard } from "../../hooks/use_dashboard";
import { ContinueLearningCard } from "./cotinue_learning_card";
export function ContinueLearningPart() {
  const{data}=useDashboard ();

  const cardsData = data?.continue_learning!;
    return(
        
 <div className="flex flex-col gap-4 ">
        {/* header */}
        <h2 className="text-2xl font-bold text-slate-900 ">
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

        <div className="grid grid-cols-3 gap-5">
          {cardsData.map((card) => (
            <ContinueLearningCard key={card.videoId} cardData={card} />
          ))}
        </div>
      </div>
    )
}