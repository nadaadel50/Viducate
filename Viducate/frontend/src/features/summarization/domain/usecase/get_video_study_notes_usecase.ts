import type { ApiResult } from "../../../../core/api/apiResult";
import type { StudyNotesRepository } from "../repository/study_notes_repository";
import type { VideoStudyNotes } from "../entity/study_notes_entity";

export class GetVideoStudyNotesUsecase {
  private repo: StudyNotesRepository;

  constructor(repo: StudyNotesRepository) {
    this.repo = repo;
  }

  execute(videoId: number): Promise<ApiResult<VideoStudyNotes>> {
    return this.repo.getVideoStudyNotes(videoId);
  }
}
