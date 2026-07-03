import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCardDetials } from "../entity/flash_card_response";
import type { SegmentFlashCardRequest } from "../entity/segment_flash_card_request";

export interface FlashCardRepo {
  getSegmentFlashCard(
    req: SegmentFlashCardRequest,
  ): Promise<ApiResult<FlashCardDetials[]>>;
  getVideoFlashCard(videoId: number): Promise<ApiResult<FlashCardDetials[]>>;
}
