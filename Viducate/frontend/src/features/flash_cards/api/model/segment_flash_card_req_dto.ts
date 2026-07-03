import type { SegmentFlashCardRequest } from "../../domain/entity/segment_flash_card_request";

export type SegmentFlashcardRequestDto = {
  videoId: number;
  segmentId: number;
};

export const toFlashCardDto = (
  entity: SegmentFlashCardRequest,
): SegmentFlashcardRequestDto => {
  return {
    videoId: entity.videoId,
    segmentId: entity.segmentId,
  };
};
