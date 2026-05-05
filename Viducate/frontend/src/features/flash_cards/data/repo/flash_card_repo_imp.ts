
import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCardRepo } from "../../domain/repository/flash_card_repo";
import type { FlashCardDataSoruce } from "../data_soruce/flash_card_data_soruce";
import type { Segment } from "../../domain/entity/flash_card_entity";
import type { SegmentFlashCardRequest } from "../../domain/entity/segment_flash_card_request";


export class FlashCardRepoImp implements FlashCardRepo {
    private dataSource: FlashCardDataSoruce;
    constructor(dataSource: FlashCardDataSoruce) {
        this.dataSource = dataSource;
    }
    getSegmentFlashCard(req: SegmentFlashCardRequest): Promise<ApiResult<Segment>> {
        return this.dataSource.getSegmentFlashCard(req);
    }
   
    
   


}