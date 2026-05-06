import type { TopicResponse } from "../../../features/watch_video/domin/entity/topic_response";

export type LearningSessionContextType = {
  videoId: number | null;

  selectedTopic: TopicResponse | null;

  currentTime: number;

  seekTo: number | null;
  completedTopicIds: Set<number>;  
  

  setVideoId: (id: number | null) => void;

  setSelectedTopic: React.Dispatch<
    React.SetStateAction<TopicResponse | null>
  >;

  setCurrentTime: (time: number) => void;

  setSeekTo: React.Dispatch<
    React.SetStateAction<number | null>
  >;
   toggleTopicComplete: (topicId: number) => void;


  //  goToNextTopic: () => void;
};