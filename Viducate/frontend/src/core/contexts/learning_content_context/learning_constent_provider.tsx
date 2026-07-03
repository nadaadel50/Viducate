import { createContext, useEffect, useRef, useState } from "react";
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
   
  }, [hasUnsavedChanges]);

  const handleSetHasUnsavedChanges = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
  };

  const [seekTo, setSeekTo] = useState<number | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const baselineRef = useRef<number>(0);

  const handleSetInitializeCurrentTime = (time: number) => {
    baselineRef.current = time;
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    if (Math.abs(currentTime - baselineRef.current) >= 10) {
      setHasUnsavedChanges(true);
    }
  }, [currentTime]);

  const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(
    null,
  );

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

  const [videoTitle, setVideoTitle] = useState<string | null>(null);

  const [topics, setTopics] = useState<TopicResponse[] | null>(null);

  const [marks, setMarks] = useState<number[]>([]);

  function handleSetMarks(marks: number[]) {
    setMarks(marks);
  }
  function handleAddMark(time: number) {
    const newMark = Math.floor(time);
    const updated = [...marks, newMark];
    setMarks(updated);
    setHasUnsavedChanges(true);
  }

  const [completedTopics, setCompletedTopics] = useState<Set<number>>(
    new Set(),
  );

  const handleSetCompletedTopics = (segmentIds: number[]) => {
    setCompletedTopics(new Set(segmentIds));
  };

  const toggleTopicComplete = (segmentId: number) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(segmentId)) {
        next.delete(segmentId);
      } else {
        next.add(segmentId);
      }
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const goToNextTopic = () => {
    if (!topics || !selectedTopic) return;

    const currentIndex = topics.findIndex(
      (topic) => topic.segment_id === selectedTopic.segment_id,
    );

    if (currentIndex === -1) return;

    const nextTopic = topics[currentIndex + 1];

    if (!nextTopic) return;

    setSelectedTopic(nextTopic);

    setSeekTo(nextTopic.start_time);
    setCurrentTime(nextTopic.start_time);
  };

  const [duration, setDuration] = useState<number>(0);

  function setDurationTime(newDuration: number) {
    setDuration(newDuration);
  }
  useEffect(() => {
    if (videoId === null) return;

    setMarks([]);
    setCompletedTopics(new Set());
    setCurrentTime(0);
    baselineRef.current = 0;
    setHasUnsavedChanges(false);
    setSeekTo(null);
    setDuration(0);
  }, [videoId]);

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

        videoTitle,
        setVideoTitle,

        topics,
        setTopics,

        completedTopics,
        toggleTopicComplete,

        goToNextTopic,

        duration,
        setDurationTime,
        marks,
        handleSetMarks,
        handleAddMark,
        handleSetCompletedTopics,
        hasUnsavedChanges,
        handleSetHasUnsavedChanges,
        handleSetInitializeCurrentTime,
      }}
    >
      {children}
    </LearningSessionContext.Provider>
  );
}
