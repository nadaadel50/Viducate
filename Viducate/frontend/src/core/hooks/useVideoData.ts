import { useQuery } from "@tanstack/react-query";
import { getTopicsUseCase } from "../di/watch_video_container";
import { TopicsRequest } from "../../features/watch_video/domin/entity/topics_request";
import { VideoResponse } from "../../features/watch_video/domin/entity/video_response";
import { TopicResponse } from "../../features/watch_video/domin/entity/topic_response";
import { useLearningSession } from "./useLearningContent";




export function useVideoData() {

  // const fakeVideos: VideoResponse = 
  // new VideoResponse(
  //   "",
  //   1,
  //   [
  //    new TopicResponse(1,1,0,261,"sara","zeht"),
  //    new TopicResponse(2,2,262,300,"sara","zeht"),
  //    new TopicResponse(3,3,301,400,"sara","zeht"),
  //   ]
  // )

 
  const {videoId}=useLearningSession()
 //const videoId=1

    // it should not take the video id from here  it should take from the data but know let it 3
  return useQuery({
    queryKey: ["topics", videoId],
   queryFn: async () => {
     const result = await getTopicsUseCase.getTopics(new TopicsRequest(videoId!));

      if (!result.success) {
        throw new Error(result.error);
      }

     // return result.data;
     console.log("🔥 fetching...");
     console.log(result.data)
    return result.data
    //  return fakeVideos
    },
    enabled: !!videoId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
