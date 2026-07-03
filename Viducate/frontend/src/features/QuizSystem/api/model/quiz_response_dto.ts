export interface QuizQuestionDto {
  question_id: number;
  question_text: string;
  choices: Record<string, string>;
  video_timestamp: number;
  timestamp_label: string;
  segment_id: number;
  concept: string;
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


export interface QuizSubmitAnswerDto {
  question_id: number;
  user_answer: string;
}

export interface QuizSubmitRequestDto {
  answers: QuizSubmitAnswerDto[];
}

export interface QuizSubmitQuestionDto {
  question_id: number;
  question_text: string;
  choices: Record<string, string>;
  user_answer: string;
  correct_answer: string;
  correct_answer_text: string;
  is_correct: boolean;
  explanation: string;
  video_timestamp: number;
  timestamp_label: string;
  segment_id: number;
  concept: string;
}

export interface QuizSubmitResponseDto {
  quiz_id: number;
  correct_count: number;
  wrong_count: number;
  total: number;
  score: number;
  trials: number;
  is_new: boolean;
  questions: QuizSubmitQuestionDto[];
}
