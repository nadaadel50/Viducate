import type  { UserPreferencesRequestDto, UserPreferencesResponseDto } from '../model/preferences_dto';
import { preferencesService } from '../client/preferences_service';

export const preferencesDataSourceImp = {
  save: (dto: UserPreferencesRequestDto): Promise<UserPreferencesResponseDto> => {
    return preferencesService.updatePreferences(dto);
  }
};