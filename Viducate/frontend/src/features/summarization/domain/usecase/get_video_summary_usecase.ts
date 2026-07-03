import type { ApiResult } from "../../../../core/api/apiResult";
import type { SummaryRepository } from "../repository/summary_repository";
import type { VideoSummary } from "../entity/summary_entity";

export class GetVideoSummaryUsecase {
  private repo: SummaryRepository;

  constructor(repo: SummaryRepository) {
    this.repo = repo;
  }

  execute(videoId: number): Promise<ApiResult<VideoSummary>> {
    return this.repo.getVideoSummary(videoId);
  }
}
