import type { VideoPreferences } from '../entity/video_preferences';
import type { UserPreferencesResponseDto } from '../../api/model/preferences_dto';

export interface PreferencesRepository {
  
  savePreferences(prefs: VideoPreferences): Promise<UserPreferencesResponseDto>;
}