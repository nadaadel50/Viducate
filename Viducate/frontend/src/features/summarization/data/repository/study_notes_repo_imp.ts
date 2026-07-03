import type { ApiResult } from "../../../../core/api/apiResult";
import type {
  SegmentStudyNotes,
  VideoStudyNotes,
} from "../../domain/entity/study_notes_entity";
import type { StudyNotesRepository } from "../../domain/repository/study_notes_repository";
import type { StudyNotesDataSource } from "../dataSource/study_notes_data_source";

export class StudyNotesRepoImp implements StudyNotesRepository {
  private dataSource: StudyNotesDataSource;
  constructor(dataSource: StudyNotesDataSource) {
    this.dataSource = dataSource;
  }

  async getSegmentStudyNotes(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentStudyNotes>> {
    const result = await this.dataSource.getSegmentStudyNotes(
      videoId,
      segmentId,
    );
    if (!result.success) return result;

    const dto = result.data;
    return {
      success: true,
      data: {
        segmentId: dto.segment_id,
        segmentNumber: dto.segment_number,
        title: dto.title,
        startTime: dto.start_time,
        endTime: dto.end_time,
        language: dto.language,
        studyNotes: dto.study_notes,
        generationFailed: dto.generation_failed,
        readingTime: dto.reading_time,
      },
    };
  }

  async getVideoStudyNotes(
    videoId: number,
  ): Promise<ApiResult<VideoStudyNotes>> {
    const result = await this.dataSource.getVideoStudyNotes(videoId);
    if (!result.success) return result;

    const dto = result.data;
    return {
      success: true,
      data: {
        videoId: dto.video_id,
        language: dto.language,
        cached: dto.cached,
        studyNotes: dto.study_notes,
        createdAt: dto.created_at,
        readingTime: dto.reading_time,
      },
    };
  }
}
