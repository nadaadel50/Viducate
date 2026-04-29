import {
  FileQuestion,
  Layers,
  NotebookText,
  TvMinimalPlay,
} from "lucide-react";
import { ContentGenerationBtn } from "./content_genration_btn";
import type { TopicResponse } from "../../domin/entity/topic_response";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useNavigate } from "react-router";
import { AppRoutesNames } from "../../../../app/routers/routes";


export function ContentLearningCard({
  isSelected,
  onClick,
  cardInfo,
}: {
  isSelected: boolean;
  onClick: () => void;
  cardInfo: TopicResponse;
}) {
  const { setSelectedTopic } = useLearningSession();
  const navigate=useNavigate()
  return (
    <div
      onClick={() => {
        onClick();
        setSelectedTopic(cardInfo);
       
      }}
      className={`cursor-pointer group relative rounded-2xl bg-white/70  p-4 transition-all hover:bg-white hover:border-primary/40 hover:shadow-soft ${isSelected ? "border-2 border-[#4f46e5] shadow-xl shadow-[#4f46e5]/15" : "border border-slate-200/60 w-80"}`}
    >
      {/* Title */}
      <div className="flex justify-between items-start">
        <h4
          className={` text-sm font-bold group-hover:text-[#4f46e5] transition-colors leading-tight ${isSelected ? "text-[#4f46e5]" : "text-slate-700"}`}
        >
          {cardInfo.title}
        </h4>

        <span className="text-[10px] font-bold  text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full group-hover:text-slate-600 transition-colors">
          {
          Math.floor((cardInfo.start_time) / 60)}:
          {Math.floor((cardInfo.start_time) % 60)
            .toString()
            .padStart(2, "0")}
        </span>
      </div>

      {/* Description */}
      <p className="line-clamp-2   text-xs text-slate-400 mt-1.5 mb-1.5 group-hover:text-slate-500 ">
        {cardInfo.main_topic}
      </p>

      <div className="grid grid-cols-4 gap-3 mt-4">
        {/* ask about this */}
        <ContentGenerationBtn
          onClick={() => {}}
          icon={<TvMinimalPlay />}
          label={"Watch"}
        />
        <ContentGenerationBtn
          onClick={() => {}}
          icon={<NotebookText />}
          label={"Summary"}
        />
        <ContentGenerationBtn
          onClick={() => {}}
          icon={<FileQuestion />}
          label={"Quiz"}
        />
        <ContentGenerationBtn
           onClick={() => {
              navigate(`/WatchVideo/flashcards/${cardInfo.segment_id}`)
            }}
          icon={<Layers />}
          label={"cards"}
        />
      </div>
    </div>
  );
}
