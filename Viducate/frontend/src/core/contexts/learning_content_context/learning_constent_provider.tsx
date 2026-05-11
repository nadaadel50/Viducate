import { createContext, useEffect, useState } from "react";
import type { TopicResponse } from "../../../features/watch_video/domin/entity/topic_response";
import type { LearningSessionContextType } from "./learning_constent_context";
import { STORAGE_KEYS } from "../../constants";

export const LearningSessionContext =
  createContext<LearningSessionContextType | null>(null);

export function LearningSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seekTo, setSeekTo] = useState<number | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.currentTime);
    return saved ? Number(saved) : 0;
  });

 

  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(
    () => {
      const saved = sessionStorage.getItem(STORAGE_KEYS.selectedTopic);
      return saved ? JSON.parse(saved) : null;
    },
  );


  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.currentTime, String(currentTime));
  }, [currentTime]);

  useEffect(() => {
    if (selectedTopic) {
      sessionStorage.setItem(
        STORAGE_KEYS.selectedTopic,
        JSON.stringify(selectedTopic),
      );
    }
  }, [selectedTopic]);

  const [videoId, setVideoIdState] = useState<number | null>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.video_Id);
    return stored ? Number(stored) : null;
  });

  const setVideoId = (id: number | null) => {
    if (id === null) {
      sessionStorage.removeItem(STORAGE_KEYS.video_Id);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.video_Id, String(id));
    }
    setVideoIdState(id);
  };

  return (
    <LearningSessionContext.Provider
      value={{
        videoId,
        setVideoId,
        selectedTopic,
        setSelectedTopic,
        currentTime,
        setCurrentTime,
        seekTo,
        setSeekTo,
      }}
    >
      {children}
    </LearningSessionContext.Provider>
  );
}
