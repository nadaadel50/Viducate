import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCard } from "../entity/flashcard_entity";
import type { SegmentFlashCardRequest } from "../entity/segment_flash_card_request";

export interface FlashCardRepo {

   getSegmentFlashCard(req:SegmentFlashCardRequest):Promise<ApiResult<FlashCard>>
   getVideoFlashCard(videoId:number):Promise<ApiResult<FlashCard>>

}