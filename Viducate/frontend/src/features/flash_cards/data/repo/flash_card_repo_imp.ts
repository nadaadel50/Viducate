
import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCardRepo } from "../../domain/repository/flash_card_repo";
import type { FlashCardDataSoruce } from "../data_soruce/flash_card_data_soruce";
import type { SegmentFlashCardRequest } from "../../domain/entity/segment_flash_card_request";
import type { FlashCard } from "../../domain/entity/flashcard_entity";


export class FlashCardRepoImp implements FlashCardRepo {
    private dataSource: FlashCardDataSoruce;
    constructor(dataSource: FlashCardDataSoruce) {
        this.dataSource = dataSource;
    }
    getVideoFlashCard(videoId: number): Promise<ApiResult<FlashCard>> {
        return this.dataSource.getVideoFlashCard(videoId)
    }
    getSegmentFlashCard(req: SegmentFlashCardRequest): Promise<ApiResult<FlashCard>> {
        return this.dataSource.getSegmentFlashCard(req);
    }
   
    
   


}