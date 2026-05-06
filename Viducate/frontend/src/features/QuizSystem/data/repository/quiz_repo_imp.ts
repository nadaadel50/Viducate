import type { QuizRepository } from '../../domain/repository/quiz_repository';
import { QuizRequest } from '../../domain/entity/quiz_request';
import { QuizEntity, QuizQuestionEntity } from '../../domain/entity/quiz_entity';
import type { QuizDataSource } from '../data_source/quiz_data_source';
import type { QuizResponseDto } from '../../api/model/quiz_response_dto';
import type { ApiResult } from '../../../../core/api/apiResult';

const mapToEntity = (dto: QuizResponseDto): QuizEntity =>
  new QuizEntity(
    dto.quiz_id,
    dto.video_id,
    dto.segment_id,
    dto.quiz_type,
    dto.difficulty,
    dto.language,
    dto.total_questions,
    dto.questions.map((q) =>
      new QuizQuestionEntity(
        q.question_id,
        q.question_text,
        Object.entries(q.choices).map(([key, value]) => ({
          id: key,
          text: value,
        })),
        q.correct_answer,
        q.correct_answer_text,
        q.explanation,
        q.video_timestamp,
        q.timestamp_label,
        q.segment_id,
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
    const result = await this.dataSource.generateVideoQuiz(
      request.videoId,
      { difficulty: request.difficulty },
    );

    if (!result.success) return result;

    return {
      success: true,
      data: mapToEntity(result.data),
    };
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

    return {
      success: true,
      data: mapToEntity(result.data),
    };
  }
}