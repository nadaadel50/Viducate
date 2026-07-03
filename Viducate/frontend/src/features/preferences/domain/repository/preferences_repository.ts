import type { VideoPreferences } from "../entity/video_preferences";
import type { ApiResult } from "../../../../core/api/apiResult";

export interface PreferencesRepository {
  savePreferences(
    prefs: VideoPreferences,
  ): Promise<ApiResult<VideoPreferences>>;
  getPreferences(videoId: number): Promise<ApiResult<VideoPreferences>>;
}
