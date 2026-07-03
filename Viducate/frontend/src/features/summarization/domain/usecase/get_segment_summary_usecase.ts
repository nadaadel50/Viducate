import type { ApiResult } from "../../../../core/api/apiResult";
import type { SummaryRepository } from "../repository/summary_repository";
import type { SegmentSummary } from "../entity/summary_entity";

export class GetSegmentSummaryUsecase {
  private repo: SummaryRepository;

  constructor(repo: SummaryRepository) {
    this.repo = repo;
  }

  execute(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentSummary>> {
    return this.repo.getSegmentSummary(videoId, segmentId);
  }
}
