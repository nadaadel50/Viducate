import type { PreferencesRepository } from '../../domain/repository/preferences_repository';
import type { VideoPreferences } from '../../domain/entity/video_preferences';
import { preferencesDataSourceImp } from '../../api/data_source/preferences_dataSource_imp';
import type { UserPreferencesResponseDto } from '../../api/model/preferences_dto';

export class PreferencesRepoImp implements PreferencesRepository {
  
  async savePreferences(prefs: VideoPreferences): Promise<UserPreferencesResponseDto> {
    const dto = {
      video_id: prefs.videoId,
      summary_language: prefs.summaryLang === 'Same as Video' ? null : prefs.summaryLang,
      quiz_language: prefs.quizLang === 'Same as Video' ? null : prefs.quizLang,
      flashcard_language: prefs.flashcardsLang === 'Same as Video' ? null : prefs.flashcardsLang,
    };

    return await preferencesDataSourceImp.save(dto);
  }
}