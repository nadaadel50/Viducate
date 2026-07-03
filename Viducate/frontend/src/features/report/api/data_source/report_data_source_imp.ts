import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";
import { reportService } from "../client/report_service";
import type { VideoReportDto } from "../model/report_dto";
import type { ReportDataSource } from "../../data/data_source/report_data_source";

export class ReportDataSourceImp implements ReportDataSource {
  async getVideoReport(videoId: number): Promise<ApiResult<VideoReportDto>> {
    try {
      const res = await reportService.getVideoReport(videoId);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}
