import type { FlashCardDetials } from "../../domain/entity/flash_card_response";

export type FlashcardDto = {
  flashcard_id: number;
  segment_id: number;
  video_id: number;
  question: string;
  answer: string;
  language: string;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
  segment_start_time: number;
  segment_end_time: number;
  segment_start_label: string;
};

export const toFlashcardEntity = (dto: FlashcardDto): FlashCardDetials => {
  return {
    flashcard_id: dto.flashcard_id,
    segment_id: dto.segment_id,
    video_id: dto.video_id,
    question: dto.question,
    answer: dto.answer,
    language: dto.language,
    difficulty: dto.difficulty,
    created_at: dto.created_at,
    segment_start_time: dto.segment_start_time,
    segment_end_time: dto.segment_end_time,
    segment_start_label: dto.segment_start_label,
  };
};
