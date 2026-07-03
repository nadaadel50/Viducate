import type { SegmentDto } from "./segment_dto";

export type VideoFlashCardResponse = {
  videoId: number;
  total_flashcards: number;
  cached: number;
  segments: SegmentDto[];
};
