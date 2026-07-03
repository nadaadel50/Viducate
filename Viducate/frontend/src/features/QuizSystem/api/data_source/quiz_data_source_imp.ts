import { quizService } from "../client/quiz_service";
import type { QuizDataSource } from "../../data/data_source/quiz_data_source";
import type {
  QuizRequestDto,
  QuizSubmitRequestDto,
} from "../model/quiz_request_dto";
import type {
  QuizResponseDto,
  QuizSubmitResponseDto,
} from "../model/quiz_response_dto";
import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";

export class QuizDataSourceImp implements QuizDataSource {
  async generateVideoQuiz(
    videoId: number,
    body: QuizRequestDto,
  ): Promise<ApiResult<QuizResponseDto>> {
    try {
      const data = await quizService.generateVideoQuiz(videoId, body);
      return { success: true, data };
    } catch (e) {
      return { success: false, error: handleApiError(e) };
    }
  }

  async generateSegmentQuiz(
    videoId: number,
    segmentId: number,
    body: QuizRequestDto,
  ): Promise<ApiResult<QuizResponseDto>> {
    try {
      const data = await quizService.generateSegmentQuiz(
        videoId,
        segmentId,
        body,
      );
      return { success: true, data };
    } catch (e) {
      return { success: false, error: handleApiError(e) };
    }
  }

  async submitQuiz(
    quizId: number,
    body: QuizSubmitRequestDto,
  ): Promise<ApiResult<QuizSubmitResponseDto>> {
    try {
      const data = await quizService.submitQuiz(quizId, body);
      return { success: true, data };
    } catch (e) {
      return { success: false, error: handleApiError(e) };
    }
  }
}
