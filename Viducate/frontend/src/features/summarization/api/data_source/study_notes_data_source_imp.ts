import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";
import { studyNotesService } from "../client/study_notes_service";
import type {
  SegmentStudyNotesResponseDto,
  VideoStudyNotesResponseDto,
} from "../model/study_notes_dto";
import type { StudyNotesDataSource } from "../../data/dataSource/study_notes_data_source";

export class StudyNotesDataSourceImp implements StudyNotesDataSource {
  async getSegmentStudyNotes(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentStudyNotesResponseDto>> {
    try {
      const res = await studyNotesService.getSegmentStudyNotes(
        videoId,
        segmentId,
      );
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
  async getVideoStudyNotes(
    videoId: number,
  ): Promise<ApiResult<VideoStudyNotesResponseDto>> {
    try {
      const res = await studyNotesService.getVideoStudyNotes(videoId);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}
