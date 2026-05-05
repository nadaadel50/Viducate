import type { ApiResult } from "../../../../core/api/apiResult";
import type { Flashcard, Segment } from "../entity/flash_card_entity";
import type { SegmentFlashCardRequest } from "../entity/segment_flash_card_request";

export interface FlashCardRepo {

   getSegmentFlashCard(req:SegmentFlashCardRequest):Promise<ApiResult<Segment>>

}