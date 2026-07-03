import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCardDetials } from "../entity/flash_card_response";
import type { SegmentFlashCardRequest } from "../entity/segment_flash_card_request";
import type { FlashCardRepo } from "../repository/flash_card_repo";

export const GetSegmentFlahsCardUseCase = (repo: FlashCardRepo) => {
  return async (
    req: SegmentFlashCardRequest,
  ): Promise<ApiResult<FlashCardDetials[]>> => {
    return repo.getSegmentFlashCard(req);
  };
};
