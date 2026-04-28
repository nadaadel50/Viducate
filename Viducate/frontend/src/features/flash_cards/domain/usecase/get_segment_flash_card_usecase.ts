import type { ApiResult } from "../../../../core/api/apiResult";
import type { Segment } from "../entity/flash_card_entity";
import type { SegmentFlashCardRequest } from "../entity/segment_flash_card_request";
import type { FlashCardRepo } from "../repository/flash_card_repo";

export const GetSegmentFlahsCardUseCase = (repo: FlashCardRepo) => {
  return async (req: SegmentFlashCardRequest): Promise<ApiResult<Segment>> => {
    return repo.getSegmentFlashCard(req);
  };
};
