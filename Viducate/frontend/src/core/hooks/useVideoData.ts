import { useQuery } from "@tanstack/react-query";
import { getTopicsUseCase } from "../di/watch_video_container";
import { TopicResponse } from "../../features/watch_video/domin/entity/topic_response";


export function useVideoData() {
  const fakeTopics: TopicResponse[] = [
      new TopicResponse(1, 3, 1, 0, 60, "Introduction", "What is AI?"),
      new TopicResponse(2, 3, 2, 61, 120, "Basics", "Machine Learning Basics"),
      new TopicResponse(
        3,
        3,
        3,
        121,
        186,
        "Deep Learning",
        "Neural Networks Intro",
      ),
      new TopicResponse(4, 3, 4, 187, 600, "Applications", "AI in Real Life"),
    ];
  
  const videoId=3
    // it should not take the video id from here  it should take from the data but know let it 3
  return useQuery({
    queryKey: ["topics", videoId],
   queryFn: async () => {
      const result = await getTopicsUseCase.getTopics({videoId});

      if (!result.success) {
        throw new Error(result.error);
      }

     // return result.data;
     return fakeTopics
    },
    enabled: !!videoId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
