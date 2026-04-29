import { useQuery } from "@tanstack/react-query";
import { getSegmentFlahsCardUseCase } from "../../../../core/di/flash_card_continer";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export const useSegmentFlashcards = (segmentId:number) => {
    const{videoId}=useLearningSession()
    console.log("here")
    console.log(segmentId,videoId)
 

  return useQuery({
   queryKey: ["flashcards", videoId, segmentId],
   queryFn: async () => {
    console.log("ehre here here here")
 
     const result = await getSegmentFlahsCardUseCase({
        videoId:videoId!,
        segmentId:segmentId
    })

      if (!result.success) {
        throw new Error(result.error);
      }

   

     return result.data
    },
    enabled: !!videoId &&segmentId!=null,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};



