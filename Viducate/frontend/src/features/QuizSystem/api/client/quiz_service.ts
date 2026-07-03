import { apiClient } from "../../../../core/api/apiClient";
import type {
  QuizRequestDto,
  QuizSubmitRequestDto,
} from "../model/quiz_request_dto";
import type {
  QuizResponseDto,
  QuizSubmitResponseDto,
} from "../model/quiz_response_dto";

export const quizService = {
  generateVideoQuiz: async (
    videoId: number,
    body: QuizRequestDto,
  ): Promise<QuizResponseDto> => {
    const response = await apiClient.post(`quiz/video/${videoId}`, body);
    return response.data;
  },

  generateSegmentQuiz: async (
    videoId: number,
    segmentId: number,
    body: QuizRequestDto,
  ): Promise<QuizResponseDto> => {
    const response = await apiClient.post(
      `quiz/video/${videoId}/segment/${segmentId}`,
      body,
    );
    return response.data;
  },

  submitQuiz: async (
    quizId: number,
    body: QuizSubmitRequestDto,
  ): Promise<QuizSubmitResponseDto> => {
    const response = await apiClient.post(`quiz/${quizId}/submit`, body);
    return response.data;
  },
};
