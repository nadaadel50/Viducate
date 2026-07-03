import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCardDetials } from "../../domain/entity/flash_card_response";
import type { SegmentFlashCardRequest } from "../../domain/entity/segment_flash_card_request";

export interface FlashCardDataSoruce {
  getSegmentFlashCard(
    req: SegmentFlashCardRequest,
  ): Promise<ApiResult<FlashCardDetials[]>>;
  getVideoFlashCard(videoId: number): Promise<ApiResult<FlashCardDetials[]>>;
}
