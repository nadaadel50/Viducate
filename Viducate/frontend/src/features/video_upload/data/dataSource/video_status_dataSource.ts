import type { ApiResult } from "../../../../core/api/apiResult";
import type { VideoStatusResponseDto } from "../../api/model/video_status_response_dto";
export interface VideoStatusDataSource {
  getVideoStatus(videoId: number): Promise<VideoStatusResponseDto>;
  cancelAnalysis(videoId: number): Promise<ApiResult<void>>;
}
