import type { ApiResult } from "../../../../core/api/apiResult";
import type { Segment } from "../../domain/entity/flash_card_entity";
import type { SegmentFlashCardRequest } from "../../domain/entity/segment_flash_card_request";


export interface FlashCardDataSoruce {

   getSegmentFlashCard(req:SegmentFlashCardRequest):Promise<ApiResult<Segment>>

}