export interface QuizOption {
  id: string;
  text: string;
}

export class QuizQuestionEntity {
  public readonly question_id: number;
  public readonly question_text: string;
  public readonly choices: QuizOption[];
  public readonly video_timestamp: number;
  public readonly timestamp_label: string;
  public readonly segment_id: number;
  public readonly concept: string;

  constructor(
    question_id: number,
    question_text: string,
    choices: QuizOption[],
    video_timestamp: number,
    timestamp_label: string,
    segment_id: number,
    concept: string,
  ) {
    this.question_id = question_id;
    this.question_text = question_text;
    this.choices = choices;
    this.video_timestamp = video_timestamp;
    this.timestamp_label = timestamp_label;
    this.segment_id = segment_id;
    this.concept = concept;
  }
}

export class QuizEntity {
  public readonly quiz_id: number;
  public readonly video_id: number;
  public readonly segment_id: number;
  public readonly quiz_type: string;
  public readonly difficulty: string;
  public readonly language: string;
  public readonly total_questions: number;
  public readonly questions: QuizQuestionEntity[];
  public readonly created_at: string;

  constructor(
    quiz_id: number,
    video_id: number,
    segment_id: number,
    quiz_type: string,
    difficulty: string,
    language: string,
    total_questions: number,
    questions: QuizQuestionEntity[],
    created_at: string,
  ) {
    this.quiz_id = quiz_id;
    this.video_id = video_id;
    this.segment_id = segment_id;
    this.quiz_type = quiz_type;
    this.difficulty = difficulty;
    this.language = language;
    this.total_questions = total_questions;
    this.questions = questions;
    this.created_at = created_at;
  }
}


export type QuizSubmitQuestion = {
  questionId: number;
  questionText: string;
  choices: QuizOption[];
  userAnswer: string;
  correctAnswer: string;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
  videoTimestamp: number;
  timestampLabel: string;
  segmentId: number;
  concept: string;
};

export type QuizSubmitResult = {
  quizId: number;
  correctCount: number;
  wrongCount: number;
  total: number;
  score: number;
  trials: number;
  isNew: boolean;
  questions: QuizSubmitQuestion[];
};
