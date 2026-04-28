import { useQuery } from "@tanstack/react-query";
import { getSegmentFlahsCardUseCase } from "../../../../core/di/flash_card_continer";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export const useSegmentFlashcards = (segmentId:number) => {
    const{videoId}=useLearningSession()
  // return useQuery({
  //   queryKey: ["flashcards", segmentId],
  //   queryFn: () => getSegmentFlahsCardUseCase({
  //       videoId:videoId!,
  //       segmentId:segmentId
  //   })
  // });

  return useQuery({
    queryKey: ["topics", segmentId],
   queryFn: async () => {
     const result = await getSegmentFlahsCardUseCase({
        videoId:videoId!,
        segmentId:segmentId
    })

      if (!result.success) {
        throw new Error(result.error);
      }

   

     return result.data
    },
    enabled: !!videoId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};



