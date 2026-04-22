import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";
import type { TopicResponse } from "../../domin/entity/topic_response";
type SelectedTopicContextType = {
  selectedTopic: TopicResponse | null;
  setSelectedTopic: Dispatch<SetStateAction<TopicResponse | null>>;
  currentTime:number;
  setCurrentTime:(time:number)=>void;
  seekTo:number|null;
  setSeekTo: Dispatch<SetStateAction<number | null>>;


};
export const SelectedTopicContext =createContext<SelectedTopicContextType | null>(null);


export function useSelectedTopic() {
  const context = useContext(SelectedTopicContext);

  if (!context) {
    throw new Error("useSelectedTopic must be used inside SelectedTopicProvider");
  }

  return context;
}