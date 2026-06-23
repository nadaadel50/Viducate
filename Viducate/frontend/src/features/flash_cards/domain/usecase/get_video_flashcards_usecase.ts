import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCard } from "../entity/flashcard_entity";

import type { FlashCardRepo } from "../repository/flash_card_repo";

export const GetVideoFlahsCardUseCase = (repo: FlashCardRepo) => {
  return async (videoId:number): Promise<ApiResult<FlashCard>> => {
  
   
    return repo.getVideoFlashCard(videoId);
  };
};
