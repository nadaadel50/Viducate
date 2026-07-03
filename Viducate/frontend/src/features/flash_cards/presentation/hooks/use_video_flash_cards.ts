import { useQuery } from "@tanstack/react-query";
import { getVideoFlashCard } from "../../../../core/di/flash_card_continer";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export const useVideoFlashcards = () => {
  const { videoId } = useLearningSession();

  return useQuery({
    queryKey: ["flashcards", "video", videoId],
    queryFn: async () => {
      const result = await getVideoFlashCard(videoId!);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!videoId,
    refetchInterval: (query) => (query.state.data?.length ? false : 3000),
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });
};
