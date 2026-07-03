import type { TopicResponse } from "../../../features/watch_video/domin/entity/topic_response";

export type LearningSessionContextType = {
  videoId: number | null;
  videoTitle: string | null;

  topics: TopicResponse[] | null;

  selectedTopic: TopicResponse | null;

  currentTime: number;

  seekTo: number | null;

  setVideoId: (id: number | null) => void;
  setVideoTitle: (title: string | null) => void;

  setTopics: (topics: TopicResponse[] | null) => void;

  setSelectedTopic: React.Dispatch<React.SetStateAction<TopicResponse | null>>;

  setCurrentTime: (time: number) => void;

  setSeekTo: React.Dispatch<React.SetStateAction<number | null>>;
  completedTopics: Set<number>;
  handleSetCompletedTopics: (segmentIds: number[]) => void;
  toggleTopicComplete: (segmentId: number) => void;
  goToNextTopic: () => void;

  duration: number | null;
  setDurationTime: (duration: number) => void;

  marks: number[];
  handleSetMarks: (marks: number[]) => void;
  handleAddMark(time: number): void;
  hasUnsavedChanges: boolean;
  handleSetHasUnsavedChanges: (hasChanges: boolean) => void;

  handleSetInitializeCurrentTime(time: number): void;
};
