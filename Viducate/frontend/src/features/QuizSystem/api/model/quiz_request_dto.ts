export interface QuizRequestDto {
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizSubmitRequestDto {
  answers: {
    question_id: number;
    user_answer: string;
  }[];
}
