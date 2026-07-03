import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";
import type { FlashCardDataSoruce } from "../../data/data_soruce/flash_card_data_soruce";
import type { FlashCardService } from "../client/flash_card_service";
import type { SegmentFlashCardRequest } from "../../domain/entity/segment_flash_card_request";
import { toFlashCardDto } from "../model/segment_flash_card_req_dto";
import { extractFlashcards, toSegmentEntity } from "../model/segment_dto";
import type { FlashCardDetials } from "../../domain/entity/flash_card_response";

export class FlashCardDataSourceImp implements FlashCardDataSoruce {
  private service: FlashCardService;
  constructor(service: FlashCardService) {
    this.service = service;
  }
  async getVideoFlashCard(
    videoId: number,
  ): Promise<ApiResult<FlashCardDetials[]>> {
    try {
      const response = await this.service.getVideoFlashCards(videoId);

      const responseFlashCards = extractFlashcards(response.segments);

      return {
        success: true,
        data: responseFlashCards,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
  async getSegmentFlashCard(
    req: SegmentFlashCardRequest,
  ): Promise<ApiResult<FlashCardDetials[]>> {
    try {
      const response = await this.service.getSegmentsFlashCards(
        toFlashCardDto(req),
      );
      const resonseEntity = toSegmentEntity(response);
      const responseFlashCards = resonseEntity.flashcards;

      return {
        success: true,
        data: responseFlashCards,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}
