import type { ApiResult } from "../../../../core/api/apiResult";
import type { VideoPreferences } from "../../domain/entity/video_preferences";

export interface PreferencesDataSource {
  save(req: VideoPreferences): Promise<ApiResult<VideoPreferences>>;
  getPreferences(videoId: number): Promise<ApiResult<VideoPreferences>>;
}
