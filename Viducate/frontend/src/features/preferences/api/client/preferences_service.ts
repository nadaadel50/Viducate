import { apiClient } from "../../../../core/api/apiClient";
import type { UserPreferencesRequestDto } from "../model/user_pref_req_dto";
import type { UserPreferencesResponseDto } from "../model/user_pref_response_dto";

export class PreferencesService {
  async updatePreferences(
    data: UserPreferencesRequestDto,
  ): Promise<UserPreferencesResponseDto> {
    const response = await apiClient.put<UserPreferencesResponseDto>(
      "/preferences/content-language",
      data,
    );
    return response.data;
  }

  async getPreferences(videoId: number): Promise<UserPreferencesResponseDto> {
    const response = await apiClient.get<UserPreferencesResponseDto>(
      `/preferences/content-language/${videoId}`,
    );
    return response.data;
  }
}
