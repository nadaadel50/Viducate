import {apiClient }from '../../../../core/api/apiClient';
import type { UserPreferencesRequestDto, UserPreferencesResponseDto } from '../model/preferences_dto';

export const preferencesService = {
  updatePreferences: async (data: UserPreferencesRequestDto): Promise<UserPreferencesResponseDto> => {
    const response = await apiClient.put<UserPreferencesResponseDto>('/preferences/content-language', data);
    return response.data;
  }
};