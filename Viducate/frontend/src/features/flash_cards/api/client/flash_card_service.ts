import { apiClient } from "../../../../core/api/apiClient";
import type { SegmentDto } from "../model/segment_dto";
import type { SegmentFlashcardRequestDto } from "../model/segment_flash_card_req_dto";
import type { VideoFlashCardResponse } from "../model/video_flashcard_response";

export class FlashCardService {
  async getSegmentsFlashCards(
    reqDto: SegmentFlashcardRequestDto,
  ): Promise<SegmentDto> {
    const response = await apiClient.post(
      `/flashcards/video/${reqDto.videoId}/segment/${reqDto.segmentId}/generate`,
      {},
    );

    return response.data;
  }
  async getVideoFlashCards(videoId: number): Promise<VideoFlashCardResponse> {
    const response = await apiClient.get(`/flashcards/video/${videoId}`, {});

    return response.data;
  }
}
