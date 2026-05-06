export interface QuizQuestionDto {
  question_id: number;
  question_text: string;
  choices: Record<'a' | 'b' | 'c' | 'd', string>;
  correct_answer: string;
  correct_answer_text: string;
  explanation: string;
  video_timestamp: number;
  timestamp_label: string;
  segment_id: number;
}

export interface QuizResponseDto {
  quiz_id: number;
  video_id: number;
  segment_id: number;
  quiz_type: string;
  difficulty: string;
  language: string;
  total_questions: number;
  questions: QuizQuestionDto[];
  created_at: string;
}