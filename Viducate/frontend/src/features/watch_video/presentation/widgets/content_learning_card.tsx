import { FileQuestion, Layers, NotebookText, TvMinimalPlay } from "lucide-react";
import { ContentGenerationBtn } from "./content_genration_btn";

export function ContentLearningCard({isSelected, onClick}: {isSelected: boolean; onClick: () => void}) {
    return (
        <div 
        className={`group relative rounded-2xl bg-white/70  p-4 transition-all hover:bg-white hover:border-primary/40 hover:shadow-soft ${isSelected? "border-2 border-[#4f46e5] shadow-xl shadow-[#4f46e5]/15":"border border-slate-200/60 "}`}
        
        >
              {/* Title */}
              <div className="flex justify-between items-start">
                <h4 className={`truncate text-sm font-bold group-hover:text-[#4f46e5] transition-colors leading-tight ${isSelected? "text-[#4f46e5]":"text-slate-700"}`}>
                  Continuity Basics
                </h4>

                <span className="text-[10px] font-bold  text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full group-hover:text-slate-600 transition-colors">
                  08:20
                </span>
              </div>

              {/* Description */}
              <p className="truncate text-xs text-slate-400 mt-1.5 mb-1.5 group-hover:text-slate-500">
                Defining continuity at a point
              </p>

              <div className="grid grid-cols-4 gap-3 mt-4">
                <ContentGenerationBtn onClick={() => {onClick()}} icon={<TvMinimalPlay />} label={"Watch"}/>
                <ContentGenerationBtn onClick={() => {}} icon={<NotebookText  />} label={"Summary"}/>
                <ContentGenerationBtn onClick={() => {}} icon={<FileQuestion   />} label={"Quiz"}/>
                <ContentGenerationBtn onClick={() => {}} icon={<Layers  />} label={"cards"}/>
           
              </div>
              
            </div>
    )
}