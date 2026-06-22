import { useQuery } from "@tanstack/react-query";
import { getSegmentFlahsCardUseCase } from "../../../../core/di/flash_card_continer";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import type { FlashCard } from "../../domain/entity/flash_card_response";

export const useSegmentFlashcards = (segmentId:number) => {
    const{videoId}=useLearningSession()
return useQuery<FlashCard>({
  queryKey: ["flashcards", videoId, segmentId],
  queryFn: async () => {
    const result = await getSegmentFlahsCardUseCase({
      videoId: videoId!,
      segmentId,
    });
    if (!result.success) throw new Error(result.error);
    return result.data;
  },
  enabled: !!videoId && !!segmentId,

refetchInterval: (query) => {
  const data = query.state.data as FlashCard | undefined;

  const flashcards = data?.flashcards;

  if (flashcards && flashcards.length > 0) return false;

  return 3000;
},
  
  gcTime: 0,
  staleTime: 0,
  refetchOnWindowFocus: false,
  refetchOnMount: "always",
});


};



