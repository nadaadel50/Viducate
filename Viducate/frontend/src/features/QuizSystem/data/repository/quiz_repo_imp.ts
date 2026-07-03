import type { QuizRepository } from "../../domain/repository/quiz_repository";
import { QuizRequest } from "../../domain/entity/quiz_request";
import {
  QuizEntity,
  QuizQuestionEntity,
  type QuizSubmitResult,
} from "../../domain/entity/quiz_entity";
import type { QuizDataSource } from "../data_source/quiz_data_source";
import type { QuizResponseDto } from "../../api/model/quiz_response_dto";
import type { ApiResult } from "../../../../core/api/apiResult";

const mapToEntity = (dto: QuizResponseDto): QuizEntity =>
  new QuizEntity(
    dto.quiz_id,
    dto.video_id,
    dto.segment_id,
    dto.quiz_type,
    dto.difficulty,
    dto.language,
    dto.total_questions,
    dto.questions.map(
      (q) =>
        new QuizQuestionEntity(
          q.question_id,
          q.question_text,
          Object.entries(q.choices).map(([key, value]) => ({
            id: key,
            text: value,
          })),
          q.video_timestamp,
          q.timestamp_label,
          q.segment_id,
          q.concept,
        ),
    ),
    dto.created_at,
  );

export class QuizRepoImp implements QuizRepository {
  private readonly dataSource: QuizDataSource;

  constructor(dataSource: QuizDataSource) {
    this.dataSource = dataSource;
  }
  async generateVideoQuiz(
    request: QuizRequest,
  ): Promise<ApiResult<QuizEntity>> {
    const result = await this.dataSource.generateVideoQuiz(request.videoId, {
      difficulty: request.difficulty,
    });
    if (!result.success) return result;
    return { success: true, data: mapToEntity(result.data) };
  }

  async generateSegmentQuiz(
    request: QuizRequest,
  ): Promise<ApiResult<QuizEntity>> {
    const result = await this.dataSource.generateSegmentQuiz(
      request.videoId,
      request.segmentId!,
      { difficulty: request.difficulty },
    );
    if (!result.success) return result;
    return { success: true, data: mapToEntity(result.data) };
  }

  async submitQuiz(
    quizId: number,
    answers: Record<string, string>,
  ): Promise<ApiResult<QuizSubmitResult>> {
    const result = await this.dataSource.submitQuiz(quizId, {
      answers: Object.entries(answers).map(([question_id, user_answer]) => ({
        question_id: Number(question_id),
        user_answer,
      })),
    });

    if (!result.success) return result;

    const dto = result.data;
    return {
      success: true,
      data: {
        quizId: dto.quiz_id,
        correctCount: dto.correct_count,
        wrongCount: dto.wrong_count,
        total: dto.total,
        score: dto.score,
        trials: dto.trials,
        isNew: dto.is_new,
        questions: dto.questions.map((q) => ({
          questionId: q.question_id,
          questionText: q.question_text,
          choices: Object.entries(q.choices).map(([key, value]) => ({
            id: key,
            text: String(value),
          })),
          userAnswer: q.user_answer,
          correctAnswer: q.correct_answer,
          correctAnswerText: q.correct_answer_text,
          isCorrect: q.is_correct,
          explanation: q.explanation,
          videoTimestamp: q.video_timestamp,
          timestampLabel: q.timestamp_label,
          segmentId: q.segment_id,
          concept: q.concept,
        })),
      },
    };
  }
}
