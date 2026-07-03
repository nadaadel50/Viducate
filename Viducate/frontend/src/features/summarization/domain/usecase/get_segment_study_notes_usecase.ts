import type { ApiResult } from "../../../../core/api/apiResult";
import type { StudyNotesRepository } from "../repository/study_notes_repository";
import type { SegmentStudyNotes } from "../entity/study_notes_entity";

export class GetSegmentStudyNotesUsecase {
  private repo: StudyNotesRepository;

  constructor(repo: StudyNotesRepository) {
    this.repo = repo;
  }

  execute(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentStudyNotes>> {
    return this.repo.getSegmentStudyNotes(videoId, segmentId);
  }
}
