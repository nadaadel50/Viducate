import type { ApiResult } from "../../../../core/api/apiResult";
import type { ReportRepository } from "../repository/report_repository";
import type { VideoReport } from "../entity/report_entity";

export class GetVideoReportUsecase {
  private repo: ReportRepository;

  constructor(repo: ReportRepository) {
    this.repo = repo;
  }

  execute(videoId: number): Promise<ApiResult<VideoReport>> {
    return this.repo.getVideoReport(videoId);
  }
}
