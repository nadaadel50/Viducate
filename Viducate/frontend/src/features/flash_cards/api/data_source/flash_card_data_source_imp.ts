
import type { ApiResult } from "../../../../core/api/apiResult";

import handleApiError from "../../../../core/api/apiError";
import type { FlashCardDataSoruce } from "../../data/data_soruce/flash_card_data_soruce";
import type { FlashCardService } from "../client/flash_card_service";
import type { Segment } from "../../domain/entity/flash_card_entity";
import type { SegmentFlashCardRequest } from "../../domain/entity/segment_flash_card_request";
import { toFlashCardDto } from "../model/segment_flash_card_req_dto";
import { toFlashcardEntity } from "../model/flash_card_dto";
import { toSegmentEntity } from "../model/segment_dto";


export class FlashCardDataSourceImp implements FlashCardDataSoruce {
  private service: FlashCardService;
  constructor(service: FlashCardService) {
    this.service = service;
  }
  async getSegmentFlashCard(req: SegmentFlashCardRequest): Promise<ApiResult<Segment>> {
    try{
  
      const response=await this.service.getSegmentsFlashCards(toFlashCardDto(req))
      const resonseEntity=toSegmentEntity(response)
    
      return{
        success:true,
        data:resonseEntity

      }

    }
    catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
    
   
  }
  
  
}
