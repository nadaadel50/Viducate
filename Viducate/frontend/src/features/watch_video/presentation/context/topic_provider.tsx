import { useState } from "react";
import type { TopicResponse } from "../../domin/entity/topic_response";
import { SelectedTopicContext } from "./topic_context";

export function SelectedTopicProvider({ children }: { children: React.ReactNode }) {
  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(null);
    return (
      <SelectedTopicContext.Provider value={{ selectedTopic, setSelectedTopic }}>
        {children}
      </SelectedTopicContext.Provider>
    );
}


