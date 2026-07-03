import { VideoStatusService } from "../client/video_status_service";
import type { VideoStatusDataSource } from "../../data/dataSource/video_status_dataSource";
import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";

export class VideoStatusDataSourceImp implements VideoStatusDataSource {
  private service: VideoStatusService;
  constructor(service: VideoStatusService) {
    this.service = service;
  }

  async getVideoStatus(videoId: number) {
    return await this.service.getVideoStatus(videoId);
  }
  async cancelAnalysis(videoId: number): Promise<ApiResult<void>> {
    try {
      await this.service.cancelAnalysis(videoId);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}
