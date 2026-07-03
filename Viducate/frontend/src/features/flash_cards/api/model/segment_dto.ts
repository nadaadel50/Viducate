import type { FlashCardDetials } from "../../domain/entity/flash_card_response";
import type { FlashCard } from "../../domain/entity/flashcard_entity";
import { type FlashcardDto, toFlashcardEntity } from "./flash_card_dto";

export type SegmentDto = {
  segment_id: number;
  segment_number: number;
  title: string;
  start_time: number;
  end_time: number;
  start_time_label: string;
  end_time_label: string;
  flashcards: FlashcardDto[];
};
export const toSegmentEntity = (dto: SegmentDto): FlashCard => {
  return {
    segment_id: dto.segment_id,
    segment_number: dto.segment_number,
    title: dto.title,
    start_time: dto.start_time,
    end_time: dto.end_time,
    start_time_label: dto.start_time_label,
    end_time_label: dto.end_time_label,
    flashcards: dto.flashcards.map(toFlashcardEntity),
  };
};

export const extractFlashcards = (
  segments: SegmentDto[],
): FlashCardDetials[] => {
  return segments.flatMap((segment) =>
    segment.flashcards.map(toFlashcardEntity),
  );
};
