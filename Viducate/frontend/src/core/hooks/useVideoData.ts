import { useQuery } from "@tanstack/react-query";
import { getTopicsUseCase } from "../di/watch_video_container";
import { TopicsRequest } from "../../features/watch_video/domin/entity/topics_request";
import { useLearningSession } from "./useLearningContent";




export function useVideoData() {

  const {videoId}=useLearningSession()
 
  return useQuery({
    queryKey: ["topics", videoId],
   queryFn: async () => {
     const result = await getTopicsUseCase.getTopics(new TopicsRequest(videoId!));

      if (!result.success) {
        throw new Error(result.error);
      }

    
     console.log("🔥 fetching...");
     console.log(result.data)
    return result.data
    //  return fakeVideos
    },
    enabled: !!videoId,
   
  });
}
