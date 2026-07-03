import type { ApiResult } from "../../../../core/api/apiResult";
import type { VideoStatusEntity } from "../entity/video_status_entity";
export interface VideoStatusRepository {
  getVideoStatus(videoId: number): Promise<VideoStatusEntity>;
  cancelAnalysis(videoId: number): Promise<ApiResult<void>>;
}
