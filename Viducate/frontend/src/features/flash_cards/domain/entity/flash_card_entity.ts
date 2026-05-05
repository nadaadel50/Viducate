export type Flashcard = {
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

export type Segment = {
  segment_id: number;
  segment_number: number;
  title: string;
  start_time: number;
  end_time: number;
  start_time_label: string;
  end_time_label: string;
  flashcards: Flashcard[];
};