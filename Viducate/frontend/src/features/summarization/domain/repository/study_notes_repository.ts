import type { ApiResult } from "../../../../core/api/apiResult";
import type {
  SegmentStudyNotes,
  VideoStudyNotes,
} from "../entity/study_notes_entity";

export interface StudyNotesRepository {
  getSegmentStudyNotes(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentStudyNotes>>;
  getVideoStudyNotes(videoId: number): Promise<ApiResult<VideoStudyNotes>>;
}
