import { useEffect, useState } from "react";
import type { TopicResponse } from "../../domin/entity/topic_response";
import { SelectedTopicContext } from "./topic_context";
import { STORAGE_KEYS } from "../../../../core/constants";



export function SelectedTopicProvider({ children }: { children: React.ReactNode }) {

 
  const [currentTime, setCurrentTime] = useState<number>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.currentTime);
    return saved ? Number(saved) : 0;
  });
 
 // const [currentTime, setCurrentTime] = useState<number>(0);


  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.selectedTopic);
    return saved ? JSON.parse(saved) : null;
  });
  //const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(null);

  const [seekTo, setSeekTo] = useState<number | null>(null);

  // ───────── SAVE SECTION ─────────



  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.currentTime, String(currentTime));
  }, [currentTime]);

  useEffect(() => {
    if (selectedTopic) {
      sessionStorage.setItem(
        STORAGE_KEYS.selectedTopic,
        JSON.stringify(selectedTopic)
      );
    }
  }, [selectedTopic]);


  

  return (
    <SelectedTopicContext.Provider
      value={{
        selectedTopic,
        setSelectedTopic,
        currentTime,
        setCurrentTime,
        seekTo,
        setSeekTo
       
      
      }}
    >
      {children}
    </SelectedTopicContext.Provider>
  );
}