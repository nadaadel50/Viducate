import { FlashCardService } from "../../features/flash_cards/api/client/flash_card_service";
import { FlashCardDataSourceImp } from "../../features/flash_cards/api/data_source/flash_card_data_source_imp";
import { FlashCardRepoImp } from "../../features/flash_cards/data/repo/flash_card_repo_imp";
import { GetSegmentFlahsCardUseCase } from "../../features/flash_cards/domain/usecase/get_segment_flash_card_usecase";
import { GetVideoFlahsCardUseCase } from "../../features/flash_cards/domain/usecase/get_video_flashcards_usecase";

const flashCardService = new FlashCardService();
const dataSource = new FlashCardDataSourceImp(flashCardService);
const repository = new FlashCardRepoImp(dataSource);

export const getSegmentFlahsCardUseCase =
  GetSegmentFlahsCardUseCase(repository);
export const getVideoFlashCard = GetVideoFlahsCardUseCase(repository);
