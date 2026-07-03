import type { PreferencesRepository } from "../../domain/repository/preferences_repository";
import type { VideoPreferences } from "../../domain/entity/video_preferences";
import type { PreferencesDataSource } from "../dataSource/preferences_dataSource";
import type { ApiResult } from "../../../../core/api/apiResult";

export class PreferencesRepoImp implements PreferencesRepository {
  private dataSource: PreferencesDataSource;
  constructor(dataSource: PreferencesDataSource) {
    this.dataSource = dataSource;
  }
  async savePreferences(
    prefs: VideoPreferences,
  ): Promise<ApiResult<VideoPreferences>> {
    return await this.dataSource.save(prefs);
  }

  async getPreferences(videoId: number): Promise<ApiResult<VideoPreferences>> {
    return await this.dataSource.getPreferences(videoId);
  }
}
