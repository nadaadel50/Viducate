import type { UserPreferencesRequestDto, UserPreferencesResponseDto } from '../../api/model/preferences_dto';

export interface PreferencesDataSource {
  save(dto: UserPreferencesRequestDto): Promise<UserPreferencesResponseDto>;
}