import { useState } from "react";

export function useMainBtn() {
  const [completeTopics, setCompleteTopics] = useState<number[]>([]);

  const handleComplete = (topicId: number) => {
    setCompleteTopics((prev) =>
      prev.includes(topicId) ? prev : [...prev, topicId],
    );
  };

  return {
    handleComplete,
    completeTopics,
  };
}
