import type { ApiResult } from "../../../../core/api/apiResult";
import type {
  SegmentStudyNotesResponseDto,
  VideoStudyNotesResponseDto,
} from "../../api/model/study_notes_dto";

export interface StudyNotesDataSource {
  getSegmentStudyNotes(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentStudyNotesResponseDto>>;
  getVideoStudyNotes(
    videoId: number,
  ): Promise<ApiResult<VideoStudyNotesResponseDto>>;
}
