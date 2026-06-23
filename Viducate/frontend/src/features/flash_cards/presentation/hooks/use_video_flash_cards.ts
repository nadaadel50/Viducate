import { useQuery } from "@tanstack/react-query";

import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { getVideoFlashCard } from "../../../../core/di/flash_card_continer";

export function useGetVideoFlashCards() {
    const{videoId}=useLearningSession()
   
  return useQuery({
    queryKey: ["video_flashCard",videoId],

queryFn:async () => {
  
    const response=await getVideoFlashCard(videoId!);
    if(!response.success){
        throw new Error(response.error);
    }
   
     return response.data
},

    enabled: false,
  });
}
