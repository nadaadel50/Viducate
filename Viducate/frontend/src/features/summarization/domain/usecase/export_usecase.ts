import type { ApiResult } from "../../../../core/api/apiResult";
import type { ExportRepository } from "../repository/export_repository";

export class ExportUsecase {
  private repo: ExportRepository;

  constructor(repo: ExportRepository) {
    this.repo = repo;
  }

  downloadVideoSummary(videoId: number): Promise<ApiResult<Blob>> {
    return this.repo.downloadVideoSummary(videoId);
  }

  downloadSegmentSummary(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<Blob>> {
    return this.repo.downloadSegmentSummary(videoId, segmentId);
  }

  downloadVideoStudyNotes(videoId: number): Promise<ApiResult<Blob>> {
    return this.repo.downloadVideoStudyNotes(videoId);
  }

  downloadSegmentStudyNotes(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<Blob>> {
    return this.repo.downloadSegmentStudyNotes(videoId, segmentId);
  }
}
