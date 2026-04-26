import { useQuery } from "@tanstack/react-query";
import { getTopicsUseCase } from "../di/watch_video_container";
import { useVideoId } from "./useVideoId";
import { TopicsRequest } from "../../features/watch_video/domin/entity/topics_request";


export function useVideoData() {

  // const fakeVideos: VideoResponse = 
  // new VideoResponse(
  //   "https://example.com/video1.mp4",
  //   1,
  //   [
  //    new TopicResponse(1,1,0,2,"sara","zeht"),
  //    new TopicResponse(1,1,0,2,"sara","zeht"),
  //    new TopicResponse(1,1,0,2,"sara","zeht"),
  //   ]
  // )

 
  const {videoId}=useVideoId()
    // it should not take the video id from here  it should take from the data but know let it 3
  return useQuery({
    queryKey: ["topics", videoId],
   queryFn: async () => {
      const result = await getTopicsUseCase.getTopics(new TopicsRequest(videoId!));

      if (!result.success) {
        throw new Error(result.error);
      }

     // return result.data;
     return result.data
    },
    enabled: !!videoId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
