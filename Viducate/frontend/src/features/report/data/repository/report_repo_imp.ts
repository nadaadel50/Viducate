import type { ApiResult } from "../../../../core/api/apiResult";
import type { ReportDataSource } from "../data_source/report_data_source";
import type { ReportRepository } from "../../domain/repository/report_repository";
import type { VideoReport } from "../../domain/entity/report_entity";
import type { VideoReportDto } from "../../api/model/report_dto";

function mapReport(dto: VideoReportDto): VideoReport {
  return {
    videoId: dto.video_id,
    title: dto.title,
    updatedAt: dto.updated_at,
    overallScore: dto.overall_score_in_video,
    correctAnswers: dto.correct_answers,
    totalQuizQuestions: dto.total_quiz_questions,
    hasSummary: dto.has_summary,
    hasStudyNotes: dto.has_study_notes,
    hasComprehensiveQuiz: dto.has_comprehensive_quiz,
    totalFlashcards: dto.total_flashcards_generated,
    strongTopics: dto.strong_topics,
    weakTopics: dto.weak_topics,
    topics: dto.topics.map((t) => ({
      id: t.id,
      title: t.title,
      quizScore: t.quiz_score,
      masteryLevel: t.mastery_level,
      correctAnswers: t.correct_answers,
      quizTotal: t.quiz_total,
      quizAttempts: t.quiz_attempts,
      weakAreas: t.weak_areas,
      materialsGenerated: {
        summary: t.materials_generated.summary,
        studyNotes: t.materials_generated.study_notes,
        quiz: t.materials_generated.quiz,
        flashcards: t.materials_generated.flashcards,
      },
    })),
  };
}

export class ReportRepoImp implements ReportRepository {
  private dataSource: ReportDataSource;
  constructor(dataSource: ReportDataSource) {
    this.dataSource = dataSource;
  }

  async getVideoReport(videoId: number): Promise<ApiResult<VideoReport>> {
    const result = await this.dataSource.getVideoReport(videoId);
    if (!result.success) return result;
    return { success: true, data: mapReport(result.data) };
  }
}
