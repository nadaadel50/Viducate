export type MaterialsGeneratedDto = {
  summary: boolean;
  study_notes: boolean;
  quiz: boolean;
  flashcards: number;
};

export type TopicReportDto = {
  id: string;
  title: string;
  quiz_score: number;
  mastery_level: string;
  correct_answers: number;
  quiz_total: number;
  quiz_attempts: number;
  weak_areas: string[];
  materials_generated: MaterialsGeneratedDto;
};

export type VideoReportDto = {
  video_id: number;
  title: string;
  updated_at: string;
  overall_score_in_video: number;
  correct_answers: number;
  total_quiz_questions: number;
  has_summary: boolean;
  has_study_notes: boolean;
  has_comprehensive_quiz: boolean;
  total_flashcards_generated: number;
  strong_topics: string[];
  weak_topics: string[];
  topics: TopicReportDto[];
};
