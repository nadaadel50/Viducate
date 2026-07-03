import { apiClient } from "../../../../core/api/apiClient";
import type { VideoReportDto } from "../model/report_dto";

export const reportService = {
  getVideoReport: (videoId: number) =>
    apiClient.get<VideoReportDto>(`/reports/video/${videoId}`),
};
