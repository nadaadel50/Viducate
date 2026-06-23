import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCard } from "../entity/flashcard_entity";

import type { SegmentFlashCardRequest } from "../entity/segment_flash_card_request";
import type { FlashCardRepo } from "../repository/flash_card_repo";

export const GetSegmentFlahsCardUseCase = (repo: FlashCardRepo) => {
  return async (req: SegmentFlashCardRequest): Promise<ApiResult<FlashCard>> => {
  
   
    return repo.getSegmentFlashCard(req);
  };
};
