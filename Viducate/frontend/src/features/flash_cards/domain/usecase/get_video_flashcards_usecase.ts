import type { ApiResult } from "../../../../core/api/apiResult";
import type { FlashCardDetials } from "../entity/flash_card_response";
import type { FlashCardRepo } from "../repository/flash_card_repo";

export const GetVideoFlahsCardUseCase = (repo: FlashCardRepo) => {
  return async (videoId: number): Promise<ApiResult<FlashCardDetials[]>> => {
    return repo.getVideoFlashCard(videoId);
  };
};
