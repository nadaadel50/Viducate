import { useState } from "react";
import { ContentLearningCard } from "../widgets/content_learning_card";
import { SearchTopicBar } from "../widgets/search_topic_bar";

export function LeftContentSection() {
    const[selectedTopic, setSelectedTopic] = useState(0);
    const cards = [1,2,3,4,5,6,7,8];
  return (
    <>
      <div className="flex flex-col h-full w-full  ">
        <div className="flex-1  flex items-center justify-center p-5">
          <SearchTopicBar />
        </div>
        <div className="flex-[7]  flex items-center justify-center">
          <div className="flex flex-col w-full h-full p-4 gap-3">
            {
                cards.map((card, index) => (
                    <ContentLearningCard 
                    key={index}
                    isSelected={selectedTopic === index}
                    onClick={() => setSelectedTopic(index)}
                    />
                ))
            }
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* <button class="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/50 border border-slate-200/60 text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-white shadow-sm transition-all dark:bg-slate-900/30 dark:border-slate-700/50 dark:hover:bg-slate-800" title="Watch">
<span class="material-symbols-outlined mb-1 text-[20px]">visibility</span>
<span class="text-[9px] font-bold uppercase tracking-wide">Watch</span> */
}
