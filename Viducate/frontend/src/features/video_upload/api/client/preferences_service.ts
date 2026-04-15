import {apiClient }from '../../../../core/api/apiClient';
import type { UserPreferencesRequestDto, UserPreferencesResponseDto } from '../model/preferences_dto';

export const preferencesService = {
  updatePreferences: async (data: UserPreferencesRequestDto): Promise<UserPreferencesResponseDto> => {
    const response = await apiClient.post<UserPreferencesResponseDto>('/user/update-preferences', data);
    return response.data;
  }
};