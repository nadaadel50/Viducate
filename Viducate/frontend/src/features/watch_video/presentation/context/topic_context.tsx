import { createContext, useContext, useState } from "react";
import type { TopicResponse } from "../../domin/entity/topic_response";
type SelectedTopicContextType = {
  selectedTopic: TopicResponse | null;
  setSelectedTopic: (topic: TopicResponse | null) => void;
};
export const SelectedTopicContext =createContext<SelectedTopicContextType | null>(null);


export function useSelectedTopic() {
  const context = useContext(SelectedTopicContext);

  if (!context) {
    throw new Error("useSelectedTopic must be used inside SelectedTopicProvider");
  }

  return context;
}