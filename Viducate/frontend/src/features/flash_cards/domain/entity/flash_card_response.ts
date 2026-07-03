export type FlashCardDetials = {
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
