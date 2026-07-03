import type { ApiResult } from "../../../../core/api/apiResult";
import type {
  QuizRequestDto,
  QuizSubmitRequestDto,
} from "../../api/model/quiz_request_dto";
import type {
  QuizResponseDto,
  QuizSubmitResponseDto,
} from "../../api/model/quiz_response_dto";

export interface QuizDataSource {
  generateVideoQuiz(
    videoId: number,
    body: QuizRequestDto,
  ): Promise<ApiResult<QuizResponseDto>>;
  generateSegmentQuiz(
    videoId: number,
    segmentId: number,
    body: QuizRequestDto,
  ): Promise<ApiResult<QuizResponseDto>>;
  submitQuiz(
    quizId: number,
    body: QuizSubmitRequestDto,
  ): Promise<ApiResult<QuizSubmitResponseDto>>;
}
