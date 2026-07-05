import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTopicsUseCase } from "../di/watch_video_container";
import { TopicsRequest } from "../../features/watch_video/domin/entity/topics_request";
import { useLearningSession } from "./useLearningContent";

export function useVideoData() {
  const {
    videoId,
    setTopics,
    handleSetMarks,
    handleSetCompletedTopics,

    setVideoTitle,
    handleSetInitializeCurrentTime,
    setSelectedTopic,
    setCurrentTime,
    seekTo,
  } = useLearningSession();

  const query = useQuery({
    queryKey: ["topics", videoId],
    queryFn: async () => {
      const result = await getTopicsUseCase.getTopics(
        new TopicsRequest(videoId!),
      );

      if (!result.success) throw new Error(result.error);
    
      return result.data;
    },
    enabled: !!videoId,
    

    refetchOnMount: false,    
 
    
    
  });

  useEffect(() => {
    if (!query.data || query.data.topics.length === 0) return;
    

 

    setTopics(query.data.topics);
    handleSetMarks(query.data.bookmarks);
    setVideoTitle(query.data.title);
    setSelectedTopic(query.data.topics[0]);

    if (seekTo === null) {
      setCurrentTime(query.data.current_time);
      handleSetInitializeCurrentTime(query.data.current_time);
    }

    handleSetCompletedTopics(
      query.data.topics
        .filter((topic) => topic.is_completed && topic.segment_id !== null)
        .map((topic) => topic.segment_id!),
    );
  }, [query.data]);

  return query;
}
