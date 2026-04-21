import { useState } from "react";
import type { TopicResponse } from "../../domin/entity/topic_response";
import { SelectedTopicContext } from "./topic_context";

export function SelectedTopicProvider({ children }: { children: React.ReactNode }) {
  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [changeProgressValue, setChangeProgressValue] = useState(true);
    return (
      <SelectedTopicContext.Provider value={{ selectedTopic, setSelectedTopic, currentTime, setCurrentTime,changeProgressValue,setChangeProgressValue}}>
        {children}
      </SelectedTopicContext.Provider>
    );
}


