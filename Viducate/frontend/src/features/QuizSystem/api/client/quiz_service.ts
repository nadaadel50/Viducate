import { apiClient } from "../../../../core/api/apiClient";
import type  { QuizRequestDto } from '../model/quiz_request_dto';
import type { QuizResponseDto } from '../model/quiz_response_dto';

export const quizService = {
  generateVideoQuiz: (videoId: number, body: QuizRequestDto): Promise<QuizResponseDto> =>
    apiClient.post(`quiz/video/${videoId}`, body),

  generateSegmentQuiz: (videoId: number, segmentId: number, body: QuizRequestDto): Promise<QuizResponseDto> =>
    apiClient.post(`quiz/video/${videoId}/segment/${segmentId}`, body),
};