import type { ApiResult } from "../../../../core/api/apiResult";
import type { VideoReport } from "../entity/report_entity";

export interface ReportRepository {
  getVideoReport(videoId: number): Promise<ApiResult<VideoReport>>;
}
