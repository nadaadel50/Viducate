import type { ApiResult } from "../../../../core/api/apiResult";
import type { VideoStatusRepository } from "../repository/video_status_repository";

export class CancelAnalysisUsecase {
  private repo: VideoStatusRepository;

  constructor(repo: VideoStatusRepository) {
    this.repo = repo;
  }

  execute(videoId: number): Promise<ApiResult<void>> {
    return this.repo.cancelAnalysis(videoId);
  }
}
