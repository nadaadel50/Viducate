import { useQuery } from "@tanstack/react-query";
import { getTopicsUseCase } from "../di/watch_video_container";
import { useSelectedTopic } from "../../features/watch_video/presentation/context/topic_context";

export function useVideoData(videoId: number) {
  const { setSelectedTopic } = useSelectedTopic();
  return useQuery({
    queryKey: ["topics", videoId],
   queryFn: async () => {
      const result = await getTopicsUseCase.getTopics({ videoId });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!videoId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
