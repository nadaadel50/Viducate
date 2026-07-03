import type { FlashCardDetials } from "./flash_card_response";

export type FlashCard = {
  segment_id: number;
  segment_number: number;
  title: string;
  start_time: number;
  end_time: number;
  start_time_label: string;
  end_time_label: string;
  flashcards: FlashCardDetials[];
};
