import type { ApiResult } from "../../../../core/api/apiResult";
import { QuizRequest } from "../entity/quiz_request";
import type { QuizEntity, QuizSubmitResult } from "../entity/quiz_entity";

export interface QuizRepository {
  generateVideoQuiz(request: QuizRequest): Promise<ApiResult<QuizEntity>>;
  generateSegmentQuiz(request: QuizRequest): Promise<ApiResult<QuizEntity>>;
  submitQuiz(
    quizId: number,
    answers: Record<string, string>,
    questions: QuizEntity["questions"],
  ): Promise<ApiResult<QuizSubmitResult>>;
}
