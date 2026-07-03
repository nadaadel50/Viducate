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
      console.log("topics is: ",result.data)

      return result.data;
    },
    enabled: !!videoId,
    
    //refetchOnMount: "always",
    refetchOnMount: false,    
 
    
    
  });

// useVideoData.ts
useEffect(() => {
  if (!query.data || query.data.topics.length === 0) return;

  console.log("query.data is: ", query.data);

  setTopics(query.data.topics);
  handleSetMarks(query.data.bookmarks);
  setVideoTitle(query.data.title);

  if (seekTo === null) {
    console.log("came here to test")
    console.log("query.data.current_time is: ", query.data.current_time);
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
