import { fromUserPreferencesResponseDto } from "../model/user_pref_response_dto";
import { PreferencesService } from "../client/preferences_service";
import type { PreferencesDataSource } from "../../data/dataSource/preferences_dataSource";
import type { VideoPreferences } from "../../domain/entity/video_preferences";
import { toUserPreferencesRequestDto } from "../model/user_pref_req_dto";
import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";

export class PreferencesDataSourceImp implements PreferencesDataSource {
  private service: PreferencesService;
  constructor(service: PreferencesService) {
    this.service = service;
  }
  async save(req: VideoPreferences): Promise<ApiResult<VideoPreferences>> {
    try {
      const result = await this.service.updatePreferences(
        toUserPreferencesRequestDto(req),
      );
      const resultEntity = fromUserPreferencesResponseDto(result);

      return {
        success: true,
        data: resultEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }

  async getPreferences(videoId: number): Promise<ApiResult<VideoPreferences>> {
    try {
      const result = await this.service.getPreferences(videoId);
      const resultEntity = fromUserPreferencesResponseDto(result);

      return {
        success: true,
        data: resultEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}
