import type { ApiResult } from "../../../../core/api/apiResult";
import type { QuizRepository } from "../repository/quiz_repository";
import { QuizRequest } from "../entity/quiz_request";
import type { QuizEntity, QuizSubmitResult } from "../entity/quiz_entity";

export class GenerateQuizUseCase {
  private readonly repo: QuizRepository;

  constructor(repo: QuizRepository) {
    this.repo = repo;
  }
  generateVideoQuiz(request: QuizRequest): Promise<ApiResult<QuizEntity>> {
    return this.repo.generateVideoQuiz(request);
  }

  generateSegmentQuiz(request: QuizRequest): Promise<ApiResult<QuizEntity>> {
    return this.repo.generateSegmentQuiz(request);
  }

  submitQuiz(
    quizId: number,
    answers: Record<string, string>,
    questions: QuizEntity["questions"],
  ): Promise<ApiResult<QuizSubmitResult>> {
    return this.repo.submitQuiz(quizId, answers, questions);
  }
}
