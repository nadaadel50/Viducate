import { useQuery } from "@tanstack/react-query";
import { getSegmentFlahsCardUseCase } from "../../../../core/di/flash_card_continer";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export const useSegmentFlashcards = (segmentId: number) => {
  const { videoId } = useLearningSession();

  return useQuery({
    queryKey: ["flashcards", "segment", videoId, segmentId],
    queryFn: async () => {
      const result = await getSegmentFlahsCardUseCase({
        videoId: videoId!,
        segmentId,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!videoId && !!segmentId,
    refetchInterval: (query) => (query.state.data?.length ? false : 3000),
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });
};
