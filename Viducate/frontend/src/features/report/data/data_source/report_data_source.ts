import type { ApiResult } from "../../../../core/api/apiResult";
import type { VideoReportDto } from "../../api/model/report_dto";

export interface ReportDataSource {
  getVideoReport(videoId: number): Promise<ApiResult<VideoReportDto>>;
}
