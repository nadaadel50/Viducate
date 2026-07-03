import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCardRepo } from "../../domain/repository/flash_card_repo";
import type { FlashCardDataSoruce } from "../data_soruce/flash_card_data_soruce";
import type { SegmentFlashCardRequest } from "../../domain/entity/segment_flash_card_request";
import type { FlashCardDetials } from "../../domain/entity/flash_card_response";

export class FlashCardRepoImp implements FlashCardRepo {
  private dataSource: FlashCardDataSoruce;
  constructor(dataSource: FlashCardDataSoruce) {
    this.dataSource = dataSource;
  }
  getVideoFlashCard(videoId: number): Promise<ApiResult<FlashCardDetials[]>> {
    return this.dataSource.getVideoFlashCard(videoId);
  }
  getSegmentFlashCard(
    req: SegmentFlashCardRequest,
  ): Promise<ApiResult<FlashCardDetials[]>> {
    return this.dataSource.getSegmentFlashCard(req);
  }
}
